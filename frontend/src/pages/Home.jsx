import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import SearchBar from "../components/SearchBar";
import ProfileCard from "../components/ProfileCard";
import Loader from "../components/Loader";
import TerminalLog from "../components/TerminalLog";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaSearch, FaShieldAlt, FaGlobeAmericas, FaCode, FaUserSecret, FaHistory, FaDownload, FaImage,
    FaInstagram, FaFacebook, FaTwitter, FaGithub, FaTiktok, FaReddit,
    FaPinterest, FaLinkedin, FaYoutube, FaPatreon, FaProductHunt, FaSlideshare, FaBandcamp
} from 'react-icons/fa';
import {
    SiSteam, SiTwitch, SiSpotify, SiSoundcloud, SiMedium,
    SiBehance, SiFlickr, SiVimeo, SiDeviantart, SiGitlab, SiCashapp, SiVenmo
} from "react-icons/si";

export default function Home() {
    const [results, setResults] = useState([]);
    const [gender, setGender] = useState("Unknown");
    const [aiProfile, setAiProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    const [executionTime, setExecutionTime] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const startTimeRef = useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem("spi_history");
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const addToHistory = (username, count) => {
        const newItem = { username, date: new Date().toISOString(), count };
        const newHistory = [newItem, ...history.filter(h => h.username !== username)].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem("spi_history", JSON.stringify(newHistory));
    };

    // Filters
    const [activePlatform, setActivePlatform] = useState("All");
    const [activeCategory, setActiveCategory] = useState("All");
    const [filterText, setFilterText] = useState("");

    // WebSocket Ref
    const ws = useRef(null);

    const handleSearch = (username) => {
        if (!username.trim()) return;

        // Reset State
        setLoading(true);
        setResults([]);
        setGender("Unknown");
        setAiProfile(null);
        setProgress(0);
        setExecutionTime(null);
        setStatus("Initializing connection...");
        setActivePlatform("All");
        setActiveCategory("All");
        setShowHistory(false);

        if (ws.current) {
            ws.current.close();
        }

        const WS_BASE = import.meta.env.VITE_WS_URL || "ws://localhost:8000";
        const socket = new WebSocket(`${WS_BASE}/ws/search`);
        ws.current = socket;

        socket.onopen = () => {
            startTimeRef.current = Date.now();
            socket.send(JSON.stringify({ username }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "update") {
                setProgress(data.progress);
                setStatus(data.status);
            }
            else if (data.type === "result") {
                const elapsed = startTimeRef.current ? ((Date.now() - startTimeRef.current) / 1000).toFixed(1) : null;
                setProgress(100);
                setStatus("Complete");
                setTimeout(() => {
                    setResults(data.data.results);
                    setGender(data.data.gender);
                    setAiProfile(data.data.ai_profile);
                    setExecutionTime(elapsed);
                    addToHistory(username, data.data.results.length);
                    setLoading(false);
                    ws.current.close();
                }, 500);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
            setStatus("Connection Error");
            setLoading(false);
        };
    };

    const filteredResults = results.filter(r => {
        const catMatch = activeCategory === "All" || r.category === activeCategory;
        const platMatch = activePlatform === "All" || r.platform === activePlatform;
        const textMatch = r.platform.toLowerCase().includes(filterText.toLowerCase()) ||
            r.url.toLowerCase().includes(filterText.toLowerCase());
        return catMatch && platMatch && textMatch;

    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-12 scroll-smooth">
            <div className="w-full max-w-3xl flex flex-col items-center">

                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-light mb-2 tracking-tight text-white">
                        Social Profile <span className="text-neutral-500">Intelligence</span>
                    </h1>
                    <p className="text-neutral-500 text-sm">
                        AI-Powered Global Identity Reconnaissance
                    </p>
                </div>

                <SearchBar onSearch={handleSearch} />

                {/* Search History — collapsible, all screen sizes */}
                {history.length > 0 && (
                    <div className="w-full max-w-sm mb-2">
                        <button
                            onClick={() => setShowHistory(h => !h)}
                            className="text-[10px] font-mono text-neutral-600 hover:text-neutral-400 transition-colors uppercase tracking-widest w-full text-center"
                        >
                            {showHistory ? "▲ Hide History" : "▼ Recent Searches"}
                        </button>
                        <AnimatePresence>
                            {showHistory && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden mt-2 flex flex-col gap-1 border border-neutral-800 rounded-lg p-2 bg-black/40"
                                >
                                    {history.map((h, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSearch(h.username)}
                                            className="text-left text-xs text-neutral-400 hover:text-white hover:bg-white/5 px-2 py-1 rounded transition-all flex justify-between group"
                                        >
                                            <span>{h.username}</span>
                                            <span className="text-[10px] text-neutral-600 group-hover:text-emerald-500">{h.count} hits</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {loading ? (
                    <>
                        <Loader status={status} progress={progress} />
                        <TerminalLog status={status} />
                    </>
                ) : (
                    <div className="w-full mt-8">
                        {/* INTELLIGENCE REPORT - DYNAMICALLY APPEARS */}
                        <AnimatePresence>
                            {aiProfile && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mb-8 p-6 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-xl relative overflow-hidden text-neutral-200"
                                    id="target-dossier"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-500 to-white"></div>
                                    <div className="flex flex-col md:flex-row gap-6 items-center">
                                        {/* Score */}
                                        <div className="relative group">
                                            <svg className="w-24 h-24 transform -rotate-90">
                                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-neutral-900" />
                                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * (aiProfile?.score || 0)) / 100} />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-bold text-white">{aiProfile?.score || 0}</span>
                                                <span className="text-[10px] uppercase text-neutral-400">Score</span>
                                            </div>
                                        </div>
                                        {/* Dossier */}
                                        <div className="flex-1 text-left relative z-10">
                                            <div className="flex justify-between items-start mb-2">
                                                <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                                                    <span className="animate-pulse text-red-500">●</span> TARGET INSIGHTS
                                                </h2>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const element = document.getElementById("target-dossier");
                                                            if (element) {
                                                                html2canvas(element, { backgroundColor: "#000000", scale: 2 }).then(canvas => {
                                                                    const link = document.createElement("a");
                                                                    link.download = `${results[0]?.url.split('/').pop() || "target"}_dossier.png`;
                                                                    link.href = canvas.toDataURL("image/png");
                                                                    link.click();
                                                                });
                                                            }
                                                        }}
                                                        className="text-neutral-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase font-bold border border-neutral-700 rounded px-2 py-1 hover:bg-white/10"
                                                    >
                                                        <FaImage /> Image
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const blob = new Blob([JSON.stringify(aiProfile, null, 2)], { type: "application/json" });
                                                            const url = URL.createObjectURL(blob);
                                                            const a = document.createElement("a");
                                                            a.href = url;
                                                            a.download = `${results[0]?.url.split('/').pop() || "target"}_dossier.json`;
                                                            document.body.appendChild(a);
                                                            a.click();
                                                            document.body.removeChild(a);
                                                            URL.revokeObjectURL(url);
                                                        }}
                                                        className="text-neutral-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase font-bold border border-neutral-700 rounded px-2 py-1 hover:bg-white/10"
                                                    >
                                                        <FaDownload /> JSON
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-neutral-300 font-mono leading-relaxed mb-4">"{aiProfile?.summary || "Analysis unavailable."}"</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                                <div className="bg-white/5 p-2 rounded border border-white/10"><h3 className="text-[10px] font-bold text-cyan-400 uppercase">LOCATION</h3><p className="text-xs text-neutral-300 font-mono">{aiProfile?.location || "Unknown"}</p></div>
                                                <div className="bg-white/5 p-2 rounded border border-white/10"><h3 className="text-[10px] font-bold text-purple-400 uppercase">ARCHETYPE</h3><p className="text-xs text-neutral-300 font-mono">{aiProfile?.archetype || "Unknown"}</p></div>
                                                <div className="bg-white/5 p-2 rounded border border-white/10"><h3 className="text-[10px] font-bold text-emerald-400 uppercase">OCCUPATION</h3><p className="text-xs text-neutral-300 font-mono">{aiProfile?.occupation || "Unknown"}</p></div>
                                                <div className="bg-white/5 p-2 rounded border border-white/10"><h3 className="text-[10px] font-bold text-pink-400 uppercase">REAL NAME</h3><p className="text-xs text-neutral-300 font-mono blur-[2px] hover:blur-none transition-all cursor-pointer" title="Hover to Decrypt">{aiProfile?.real_name || "Unknown"}</p></div>
                                                <div className="sm:col-span-2 bg-white/5 p-2 rounded border border-white/10"><h3 className="text-[10px] font-bold text-amber-400 uppercase">ORIGIN THEORY</h3><p className="text-xs text-neutral-400 font-mono leading-tight">{aiProfile?.origin_theory || "Unknown"}</p></div>
                                                <div className="sm:col-span-2 bg-white/5 p-2 rounded border border-white/10"><h3 className="text-[10px] font-bold text-indigo-400 uppercase">COMM. STYLE</h3><p className="text-xs text-neutral-300 font-mono">{aiProfile?.communication_style || "Unknown"}</p></div>
                                                <div className="sm:col-span-2 bg-red-900/20 p-2 rounded border border-red-500/30"><h3 className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1">⚠ THREAT VECTOR</h3><p className="text-xs text-red-200/80 font-mono leading-tight">{aiProfile?.threat_vector || "None"}</p></div>
                                            </div>
                                            {/* DNA Barcode - Always Visible */}
                                            <div className="flex flex-col gap-0.5 mt-4">
                                                <span className="text-[8px] text-neutral-600 font-mono tracking-widest">DIGITAL.DNA.SEQUENCE</span>
                                                <div className="flex gap-0.5 h-4 overflow-hidden border-b border-white/10 pb-0.5">
                                                    {["Instagram", "Facebook", "Twitter", "GitHub", "TikTok", "Reddit", "Pinterest", "LinkedIn", "Steam", "Twitch"].map((plat, i) => {
                                                        const isFound = results.some(r => r.platform === plat);
                                                        return <div key={i} title={plat} className={`w-1 rounded-t-sm transition-all duration-500 ${isFound ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "bg-neutral-800"}`} style={{ height: isFound ? '100%' : '20%', opacity: isFound ? 1 : 0.3 }}></div>
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>




                        {/* Advanced Filters */}
                        {results.length > 0 && (
                            <div className="flex flex-col gap-4 mb-6">
                                {/* Quick Filter Input */}
                                <div className="flex justify-center mb-2">
                                    <input
                                        type="text"
                                        placeholder="Quick Filter (e.g. 'steam')"
                                        value={filterText}
                                        onChange={(e) => setFilterText(e.target.value)}
                                        className="bg-black/40 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:border-white/50 outline-none w-full max-w-xs text-center font-mono placeholder-neutral-600 transition-all hover:border-neutral-700"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div className="flex justify-center gap-2 flex-wrap">
                                    {["All", "Social", "Tech", "Gaming", "Creative", "Professional", "Writing"].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-3 py-1 rounded text-[10px] font-mono border transition-all ${activeCategory === cat
                                                ? "bg-white text-black border-white"
                                                : "bg-black text-neutral-500 border-neutral-800 hover:border-neutral-600"
                                                }`}
                                        >
                                            {cat.toUpperCase()}
                                        </button>
                                    ))}
                                </div>

                                {/* Platform Filter Chips (Scrollable with Icons) */}
                                <div className="relative w-full max-w-4xl mx-auto">
                                    <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent justify-start snap-x w-full">
                                        {Array.from(new Set(results.map(r => r.platform))).map(plat => {
                                            const isSelected = activePlatform === plat;

                                            // Icon Mapping
                                            const icons = {
                                                "Instagram": <FaInstagram />, "Facebook": <FaFacebook />, "Twitter": <FaTwitter />,
                                                "GitHub": <FaGithub />, "TikTok": <FaTiktok />, "Reddit": <FaReddit />,
                                                "Pinterest": <FaPinterest />, "LinkedIn": <FaLinkedin />, "YouTube": <FaYoutube />,
                                                "Steam": <SiSteam />, "Twitch": <SiTwitch />, "Spotify": <SiSpotify />,
                                                "SoundCloud": <SiSoundcloud />, "Medium": <SiMedium />, "Behance": <SiBehance />,
                                                "Flickr": <SiFlickr />, "Vimeo": <SiVimeo />, "DeviantArt": <SiDeviantart />,
                                                "GitLab": <SiGitlab />, "CashApp": <SiCashapp />, "Venmo": <SiVenmo />,
                                                "Patreon": <FaPatreon />, "Bandcamp": <FaBandcamp />,
                                                "SlideShare": <FaSlideshare />, "ProductHunt": <FaProductHunt />
                                            };

                                            return (
                                                <button
                                                    key={plat}
                                                    onClick={() => setActivePlatform(prev => prev === plat ? "All" : plat)} // Toggle Logic
                                                    className={`
                                                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all snap-center border group
                                                        ${isSelected
                                                            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105 z-10"
                                                            : "bg-neutral-900/80 text-neutral-500 border-neutral-800 hover:border-neutral-600 hover:text-white"
                                                        }
                                                    `}
                                                >
                                                    <span className={`text-sm ${isSelected ? "text-black" : "text-neutral-600 group-hover:text-white transition-colors"}`}>
                                                        {icons[plat] || <FaGlobeAmericas />}
                                                    </span>
                                                    {plat}
                                                    {isSelected && <span className="ml-1 opacity-50 text-[8px]">✕</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {/* Fade Edges for Scroll Suggestion */}
                                    <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black to-transparent pointer-events-none md:hidden" />
                                    <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none md:hidden" />
                                </div>
                            </div>
                        )}

                        {/* Results Header with Time */}
                        {results.length > 0 && executionTime !== null && (
                            <div className="text-center mb-4">
                                <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                                    EXECUTION TIME: <span className="text-emerald-500">{executionTime}s</span>
                                </span>
                            </div>
                        )}

                        {/* Results */}
                        {filteredResults.length > 0 ? (
                            <>
                                {activeCategory === "All" && filterText === "" ? (
                                    // GROUPED VIEW (By Category)
                                    ["Social", "Tech", "Gaming", "Creative", "Professional", "Writing"].map(cat => {
                                        const catResults = filteredResults.filter(r => r.category === cat);
                                        if (catResults.length === 0) return null;

                                        // Colors mapping (Noir Style - No Backgrounds, just Text/Border)
                                        const catColors = {
                                            "Social": "text-blue-400 border-blue-400/20 bg-transparent",
                                            "Tech": "text-cyan-400 border-cyan-400/20 bg-transparent",
                                            "Gaming": "text-purple-400 border-purple-400/20 bg-transparent",
                                            "Creative": "text-pink-400 border-pink-400/20 bg-transparent",
                                            "Professional": "text-emerald-400 border-emerald-400/20 bg-transparent",
                                            "Writing": "text-yellow-400 border-yellow-400/20 bg-transparent"
                                        };
                                        const style = catColors[cat] || "text-neutral-400";

                                        return (
                                            <div key={cat} className="mb-8">
                                                <div className={`flex items-center gap-2 mb-4 px-2 py-1 rounded w-fit ${style.split(" ")[2]} border ${style.split(" ")[1]}`}>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${style.split(" ")[0]}`}>
                                                        {cat}
                                                    </span>
                                                    <span className="text-[10px] text-white/50">({catResults.length})</span>
                                                </div>
                                                {catResults.map((r, i) => (
                                                    <div id={r.platform} key={i}> {/* Scroll Target */}
                                                        <ProfileCard data={r} />
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })
                                ) : (
                                    // FLAT GRID (Filtered)
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {filteredResults.map((r, i) => (
                                            <div id={r.platform} key={i}>
                                                <ProfileCard data={r} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            results.length > 0 && <div className="text-neutral-500 text-center py-10">No results for this filter.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

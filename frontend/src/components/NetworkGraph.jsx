import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaInstagram, FaFacebook, FaTwitter, FaGithub, FaTiktok, FaReddit,
    FaPinterest, FaLinkedin, FaYoutube, FaGlobeAmericas
} from 'react-icons/fa';
import {
    SiSteam, SiTwitch, SiSpotify, SiSoundcloud, SiMedium,
    SiBehance, SiFlickr, SiVimeo, SiDeviantart, SiGitlab, SiCashapp, SiVenmo
} from "react-icons/si";

export default function NetworkGraph({ results, username }) {
    if (!results || !Array.isArray(results) || results.length === 0) return null;

    const [hoveredNode, setHoveredNode] = useState(null);

    // Center Node (Target) - Increased Canvas
    const width = 400;
    const height = 400;
    const cx = width / 2;
    const cy = height / 2;
    const radius = 140; // Increased radius for more separation
    const targetName = username || "Target";

    // Icon Mapping
    const getIcon = (platform) => {
        const icons = {
            "Instagram": <FaInstagram />, "Facebook": <FaFacebook />, "Twitter": <FaTwitter />,
            "GitHub": <FaGithub />, "TikTok": <FaTiktok />, "Reddit": <FaReddit />,
            "Pinterest": <FaPinterest />, "LinkedIn": <FaLinkedin />, "YouTube": <FaYoutube />,
            "Steam": <SiSteam />, "Twitch": <SiTwitch />, "Spotify": <SiSpotify />,
            "SoundCloud": <SiSoundcloud />, "Medium": <SiMedium />, "Behance": <SiBehance />,
            "Flickr": <SiFlickr />, "Vimeo": <SiVimeo />, "DeviantArt": <SiDeviantart />,
            "GitLab": <SiGitlab />, "CashApp": <SiCashapp />, "Venmo": <SiVenmo />
        };
        return icons[platform] || <FaGlobeAmericas />;
    };

    const handleNodeClick = (platform) => {
        const element = document.getElementById(platform);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add("ring-2", "ring-white");
            setTimeout(() => element.classList.remove("ring-2", "ring-white"), 2000);
        }
    };

    // Exact Category Colors (Noir Style with Neon Glow)
    const getCategoryColor = (cat) => {
        switch (cat) {
            case "Tech": return "text-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]";
            case "Gaming": return "text-purple-400 border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.4)]";
            case "Creative": return "text-pink-400 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.4)]";
            case "Social": return "text-blue-400 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.4)]";
            case "Writing": return "text-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]";
            case "Professional": return "text-emerald-400 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]";
            default: return "text-white border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]";
        }
    };

    const getCategoryStroke = (cat) => {
        switch (cat) {
            case "Tech": return "#22d3ee";
            case "Gaming": return "#c084fc";
            case "Creative": return "#f472b6";
            case "Social": return "#60a5fa";
            case "Writing": return "#facc15";
            case "Professional": return "#34d399";
            default: return "#ffffff";
        }
    };

    // --- FORCE GRAPH LOGIC START ---
    // Instead of a static ring, we use a force layout that clusters by category.
    const [nodes, setNodes] = useState([]);
    const canvasSize = 600;

    // Define Cluster Centers for Categories
    const categories = ["Social", "Tech", "Gaming", "Creative", "Writing", "Professional", "Music", "Domain"];
    const clusterCenters = {};
    categories.forEach((cat, i) => {
        const angle = (i / categories.length) * 2 * Math.PI;
        const radius = 180; // Distance of clusters from center
        clusterCenters[cat] = {
            x: canvasSize / 2 + radius * Math.cos(angle),
            y: canvasSize / 2 + radius * Math.sin(angle)
        };
    });

    useEffect(() => {
        if (!results) return;

        // Initialize Nodes with randomized start positions near their cluster
        const newNodes = results.map(r => {
            const center = clusterCenters[r.category] || { x: canvasSize / 2, y: canvasSize / 2 };
            return {
                ...r,
                x: center.x + (Math.random() - 0.5) * 50,
                y: center.y + (Math.random() - 0.5) * 50,
            };
        });

        // Simple Force Simulation (Custom implementation for React performance)
        // We run 100 iterations synchronously to calculate positions instantly rather than animating the drift
        // This makes the UI feel "snappy" and "solid" rather than floaty.
        for (let i = 0; i < 120; i++) {
            newNodes.forEach(node => {
                const center = clusterCenters[node.category] || { x: canvasSize / 2, y: canvasSize / 2 };

                // Attraction to Cluster Center
                node.x += (center.x - node.x) * 0.05;
                node.y += (center.y - node.y) * 0.05;

                // Repulsion from other nodes (Collision)
                newNodes.forEach(other => {
                    if (node === other) return;
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 40) { // Min separation distance
                        const force = (40 - dist) * 0.1;
                        node.x += (dx / dist) * force;
                        node.y += (dy / dist) * force;
                    }
                });
            });
        }
        setNodes(newNodes);
    }, [results]);
    // --- FORCE GRAPH LOGIC END ---

    return (
        <div className="w-full flex justify-center py-8 relative overflow-hidden">
            {/* Dynamic Galaxy Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="relative" style={{ width: canvasSize, height: canvasSize }}>
                {/* SVG Connections (Center to Nodes) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {nodes.map((node, i) => (
                        <motion.line
                            key={`link-${i}`}
                            x1={canvasSize / 2} y1={canvasSize / 2}
                            x2={node.x} y2={node.y}
                            stroke={getCategoryStroke(node.category)}
                            strokeWidth="1"
                            strokeOpacity="0.15" // Subtle connections
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.01 }}
                        />
                    ))}
                    {/* Category Orbits (Visual Guide) */}
                    <circle cx={canvasSize / 2} cy={canvasSize / 2} r={180} fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="5,5" />
                </svg>

                {/* Center Node (Target) */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-black border border-white/10 rounded-full flex items-center justify-center z-20 shadow-[0_0_50px_rgba(255,255,255,0.05)] backdrop-blur-xl"
                >
                    <div className="text-center relative z-30">
                        <span className="text-[10px] font-mono text-neutral-600 block tracking-widest mb-1">TARGET</span>
                        <div className="text-xl font-bold text-white tracking-tight">{targetName}</div>
                    </div>
                </motion.div>

                {/* Satellite Nodes (Icons) */}
                <AnimatePresence>
                    {nodes.map((node, i) => (
                        <motion.button
                            key={i}
                            onClick={() => handleNodeClick(node.platform)}
                            onMouseEnter={() => setHoveredNode(node)}
                            onMouseLeave={() => setHoveredNode(null)}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1, x: node.x - 20, y: node.y - 20 }} // Subtract 20 for centering (w-10/2)
                            whileHover={{ scale: 1.4, zIndex: 60 }}
                            className={`absolute w-10 h-10 rounded-full bg-black/80 border flex items-center justify-center z-10 cursor-pointer ${getCategoryColor(node.category)} backdrop-blur-sm transition-all duration-300 left-0 top-0`}
                        >
                            <span className="text-lg opacity-90">{getIcon(node.platform)}</span>
                        </motion.button>
                    ))}
                </AnimatePresence>

                {/* Hover Tooltip - Dynamic Positioning */}
                <AnimatePresence>
                    {hoveredNode && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16 z-50 pointer-events-none"
                        >
                            <div className="bg-black/90 border border-white/20 px-4 py-2 rounded-lg text-center backdrop-blur-md shadow-2xl">
                                <span className={`block text-xs font-bold ${getCategoryColor(hoveredNode.category).split(" ")[0]}`}>
                                    {hoveredNode.platform}
                                </span>
                                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                    {hoveredNode.category}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

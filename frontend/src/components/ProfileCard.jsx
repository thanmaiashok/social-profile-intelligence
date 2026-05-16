import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaTwitter, FaGithub, FaLink, FaTiktok, FaReddit, FaPinterest, FaLinkedin, FaPatreon, FaProductHunt, FaSlideshare, FaBandcamp, FaCheckCircle } from "react-icons/fa";
import { SiSteam, SiTwitch, SiSpotify, SiSoundcloud, SiMedium, SiBehance, SiFlickr, SiVimeo, SiDeviantart, SiKeybase, SiGravatar, SiPastebin, SiRoblox, SiGumroad, SiBuymeacoffee, SiSubstack, SiLinktree, SiTelegram, SiWhatsapp, SiSignal, SiDiscord } from "react-icons/si";

// Map backend platform names to React Icons
const ICONS = {
    "Instagram": FaInstagram, "Facebook": FaFacebook, "Twitter": FaTwitter,
    "GitHub": FaGithub, "TikTok": FaTiktok, "Reddit": FaReddit,
    "Pinterest": FaPinterest, "LinkedIn": FaLinkedin, "Steam": SiSteam,
    "Twitch": SiTwitch, "Spotify": SiSpotify, "SoundCloud": SiSoundcloud,
    "Medium": SiMedium, "Behance": SiBehance, "Flickr": SiFlickr,
    "Vimeo": SiVimeo, "DeviantArt": SiDeviantart, "Patreon": FaPatreon,
    "Bandcamp": FaBandcamp, "SlideShare": FaSlideshare,
    "ProductHunt": FaProductHunt,

    // GOD MODE ICONS
    "Keybase": SiKeybase, "Gravatar": SiGravatar, "Pastebin": SiPastebin,
    "Roblox": SiRoblox, "Gumroad": SiGumroad, "BuyMeACoffee": SiBuymeacoffee,
    "Substack": SiSubstack, "Linktree": SiLinktree, "Telegram": SiTelegram,
    "WhatsApp": SiWhatsapp, "Signal": SiSignal, "Discord": SiDiscord
};

// Map platform to brand colors for a nice glow effect
const COLORS = {
    "Instagram": "hover:shadow-pink-500/20 hover:border-pink-500/30",
    "Facebook": "hover:shadow-blue-500/20 hover:border-blue-500/30",
    "Twitter": "hover:shadow-sky-500/20 hover:border-sky-500/30",
    "GitHub": "hover:shadow-purple-500/20 hover:border-purple-500/30",
    "TikTok": "hover:shadow-pink-500/20 hover:border-cyan-500/30",
    "Reddit": "hover:shadow-orange-500/20 hover:border-orange-500/30",
    "Pinterest": "hover:shadow-red-500/20 hover:border-red-500/30",
    "LinkedIn": "hover:shadow-blue-700/20 hover:border-blue-700/30",
    "Steam": "hover:shadow-blue-900/20 hover:border-blue-900/30",
    "Patreon": "hover:shadow-red-400/20 hover:border-red-400/30"
};

export default function ProfileCard({ data }) {
    if (!data) return null;
    const platform = data.platform || "Unknown";
    const url = data.url || "#";
    const statusLabel = (data.status || "Active").toUpperCase(); // Active, Private, Suspended

    // Status Colors
    const getStatusColor = (s) => {
        if (s === "PRIVATE") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        if (s === "SUSPENDED") return "bg-red-500/10 text-red-500 border-red-500/20";
        if (s === "NOT_FOUND") return "bg-neutral-500/10 text-neutral-500 border-neutral-500/20";
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    };

    const isPrivate = statusLabel === "PRIVATE";
    const isSuspended = statusLabel === "SUSPENDED";
    const isVerified = statusLabel === "VERIFIED";

    const IconComponent = ICONS[platform] || FaLink;
    const hoverClass = COLORS[platform] || "hover:shadow-white/10";

    return (
        <motion.a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -5,
                scale: 1.02,
                boxShadow: "0 10px 30px -10px rgba(255, 255, 255, 0.1)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`block mb-4 p-5 rounded-xl bg-white/5 backdrop-blur border border-white/10 ${hoverClass} group cursor-pointer no-underline relative overflow-hidden`}
        >
            <div className={`absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-transparent via-white/50 to-transparent`} />
            <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="p-3 rounded-lg bg-white/10 text-2xl text-white group-hover:scale-110 transition-transform relative">
                    <IconComponent />
                    {isPrivate && <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[10px] p-0.5 rounded-full"><FaLink size={8} /></div>}
                    {isVerified && <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] p-0.5 rounded-full ring-2 ring-black"><FaCheckCircle size={8} /></div>}
                </div>

                {/* Text Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-medium text-neutral-200">{data.platform}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wide font-bold ${getStatusColor(statusLabel)}`}>
                            {statusLabel}
                        </span>
                    </div>

                    <div className="text-sm text-neutral-400 truncate group-hover:text-white transition-colors">
                        {data.url}
                    </div>

                    {data.status_reason && (
                        <div className="text-[10px] text-neutral-500 font-mono mt-1 opacity-70">
                            {data.status_reason}
                        </div>
                    )}
                </div>
            </div>
        </motion.a>
    );
}

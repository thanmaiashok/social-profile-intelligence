import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TerminalLog({ status }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (status) {
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) + "." + Math.floor(Math.random() * 999);
            setLogs(prev => [...prev.slice(-8), `[${timestamp}] >> ${status.toUpperCase()}`]);
        }
    }, [status]);

    return (
        <div className="w-full max-w-md mt-6 p-4 bg-black border border-white/10 rounded-lg font-mono text-[10px] text-neutral-400 h-48 overflow-hidden relative shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <div className="absolute top-0 left-0 w-full bg-white/10 text-white text-[9px] px-2 py-1 uppercase tracking-widest font-bold">
                System Terminal
            </div>
            <div className="mt-4 flex flex-col gap-1">
                {logs.map((log, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="truncate"
                    >
                        <span className="text-neutral-600 mr-2">{log.split(']')[0]}]</span>
                        <span className="text-white font-bold">
                            {log.split(']')[1]}
                        </span>
                    </motion.div>
                ))}
            </div>
            <div className="absolute bottom-2 left-4 w-2 h-4 bg-white animate-pulse"></div>
        </div>
    );
}

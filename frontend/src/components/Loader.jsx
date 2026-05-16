import { motion } from "framer-motion";

export default function Loader({ status, progress }) {
    return (
        <div className="w-full max-w-md mt-8">
            <div className="flex justify-between text-xs text-neutral-400 mb-2 uppercase tracking-wider">
                <span>Processing</span>
                <span>{Math.round(progress)}%</span>
            </div>

            {/* Progress Bar Container */}
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>



            {/* Status Text */}
            <motion.div
                key={status} // Animate on text change
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-4 text-sm text-neutral-300 font-light"
            >
                {status}...
            </motion.div>
        </div>
    );
}

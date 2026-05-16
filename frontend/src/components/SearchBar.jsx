import { useState } from "react";

export default function SearchBar({ onSearch }) {
    const [value, setValue] = useState("");

    const submit = () => {
        if (value.trim()) onSearch(value.trim());
    };

    return (
        <div className="flex gap-3 mb-6 w-full max-w-sm">
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Enter username"
                className="w-full px-4 py-2 rounded-lg bg-white/5 backdrop-blur border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
            />
            <button
                onClick={submit}
                className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition whitespace-nowrap"
            >
                Search
            </button>
        </div>
    );
}

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function searchProfiles(username) {
    const response = await axios.post(`${API_BASE}/search`, { username });
    return response.data;
}

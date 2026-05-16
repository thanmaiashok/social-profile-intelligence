import Home from "./pages/Home";
import NetworkBackground from "./components/NetworkBackground";

export default function App() {
    return (
        <>
            <NetworkBackground />
            <div className="relative z-10 w-full min-h-screen">
                <Home />
            </div>
        </>
    );
}

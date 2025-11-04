import Button from "../../UI/Button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };
    const handleSignup = () => {
        navigate("/signup");
    };
    return (
        <>
            <button className="ml-3 bg-green-600 text-white hover:bg-green-700 px-4 py-2 text-base rounded-lg font-medium transition-colors mt-5" onClick={handleLogin} variant="primary" size="md" more="w-[100%] mt-5">Login</button>
            <button className="ml-3 bg-green-600 text-white hover:bg-green-700 px-4 py-2 text-base rounded-lg font-medium transition-colors mt-5" onClick={handleSignup} variant="primary" size="md" more="w-[100%] mt-5">Sign Up</button>
        </>
    );
}
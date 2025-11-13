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
            {/* <button className="ml-3 bg-green-600 text-white hover:bg-green-700 px-4 py-2 text-base rounded-lg font-medium transition-colors mt-5" onClick={handleLogin} variant="primary" size="md" more="w-[100%] mt-5">Login</button>
            <button className="ml-3 bg-green-600 text-white hover:bg-green-700 px-4 py-2 text-base rounded-lg font-medium transition-colors mt-5" onClick={handleSignup} variant="primary" size="md" more="w-[100%] mt-5">Sign Up</button> */}
            <div className="landingPageContainer">
                <div className="landingPageDiv">
                    <h1 className="text-white font-extrabold leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">Fresh Picks of the Week</h1>
                    <p className="text-white text-sm font-light leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">Discover the best seasonal produce and special offers.</p>
                    <Button more="mt-6" onClick={handleSignup}>Shop Now</Button>
                </div>
            </div>
        </>
    );
}
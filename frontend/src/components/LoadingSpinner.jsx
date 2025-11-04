import Signup from "../pages/Auth/Signup";

// components/LoadingSpinner.jsx
export default function LoadingSpinner() {
  return (
    <div>
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50 opacity-90 blur-5xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

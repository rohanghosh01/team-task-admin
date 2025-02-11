"use client";
import { useRootContext } from "@/contexts/RootContext";
import "./style.css";
const LoadingScreen = () => {
  const { loading } = useRootContext();

  if (!loading) return null;
  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50 h-screen flex-col gap-4 cursor-wait">
      {/* <div className="lds-dual-ring animate-pulse text-base font-bold">Loading...</div> */}
      <div className="loader"></div>
    </div>
  );
};

export default LoadingScreen;

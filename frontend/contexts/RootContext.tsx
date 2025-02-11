"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
interface showMessageType {
  type: "success" | "error" | "warning" | "info";
  message: string;
  description?: string;
}

// Define the shape of the context state
interface RootContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showMessage: showMessageType | null;
  setShowMessage: (message: showMessageType | null) => void;
}

// Create the initial context with default values
const RootContext = createContext<RootContextType | undefined>(undefined);

// Provider component
export const RootProvider = ({ children }: { children: ReactNode }) => {
  // States
  const [loading, setLoading] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<showMessageType | null>(null);

  // Provide the context value
  const contextValue: RootContextType = {
    loading,
    setLoading,
    setShowMessage,
    showMessage,
  };

  return (
    <RootContext.Provider value={contextValue}>{children}</RootContext.Provider>
  );
};

// Hook to use the context
export const useRootContext = () => {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error("useRootContext must be used within a RootProvider");
  }
  return context;
};

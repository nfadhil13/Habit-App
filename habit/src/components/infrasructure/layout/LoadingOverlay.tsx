"use client";

type LoadingOverlayProps = {
  children: React.ReactNode;
};

import { createContext, useContext, useState } from "react";

interface LoadingContextProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);

export const useLoadingOverlay = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoadingContext must be used within a LoadingProvider");
  }
  return context;
};

export default function LoadingOverlay({ children }: LoadingOverlayProps) {
  const isLoadingState = useState(false);
  const [isLoading, setIsLoading] = isLoadingState;
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <div className="relative">
        {isLoading && (
          <div className="absolute bg-black bg-opacity-60 z-10 w-full flex items-center justify-center h-screen">
            <div className="flex items-center">
              <span className="loading loading-bars loading-lg"></span>
            </div>
          </div>
        )}
        <section>{children}</section>
      </div>
    </LoadingContext.Provider>
  );
}

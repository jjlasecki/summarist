
"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type FontSizeContextType = {
  fontSize: number;
  setFontSize: (size: number) => void;
};

const FontSizeContext = createContext<FontSizeContextType | null>(null);

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState(14);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);

  if (!context) {
    throw new Error("useFontSize must be used within FontSizeProvider");
  }

  return context;
}

import React, { createContext, useContext, useState } from "react";
import { TextWithQuestions } from "../api";

interface GptContextType {
  textWithQuestions: TextWithQuestions;
  updateContextValue: (newValue: Partial<TextWithQuestions>) => void;
}

const GptContext = createContext<GptContextType | null>(null);

export const useGptContext = () => {
  const context = useContext(GptContext);
  if (!context) {
    throw new Error("useGptContext must be used within a GptProvider");
  }
  return context;
};

export const GptProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const initialContextValue: TextWithQuestions = {
    id: "defaultId",
    title: "Default Title",
    content: "Default Content",
    difficulty: "medium",
    wordCount: 0,
    questions: [],
  };
  const [contextValue, setContextValue] =
    useState<TextWithQuestions>(initialContextValue);

  const updateContextValue = (newValue: Partial<TextWithQuestions>) => {
    setContextValue((prevValue) => ({ ...prevValue, ...newValue }));
  };

  return (
    <GptContext.Provider
      value={{ textWithQuestions: contextValue, updateContextValue }}
    >
      {children}
    </GptContext.Provider>
  );
};

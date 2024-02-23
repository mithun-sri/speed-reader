import React, { createContext, useContext, useState } from "react";
import { TextWithQuestions } from "../api";

interface GptContextType {
  textWithQuestions: TextWithQuestions;
  updateContextValue: (newValue: Partial<TextWithQuestions>) => void;
}

const GptContext = createContext<GptContextType>({
  textWithQuestions: {
    id: "defaultId",
    title: "Default Title",
    content: "Default Content",
    difficulty: "medium",
    word_count: 0,
    questions: [],
    summary: "Default summary",
    source: "Default source",
    fiction: false,
  },
  updateContextValue: () => {},
});

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
    word_count: 0,
    questions: [],
    summary: "Default summary",
    source: "Default source",
    fiction: false,
  };
  const [contextValue, setContextValue] =
    useState<TextWithQuestions>(initialContextValue);

  const updateContextValue = (newValue: Partial<TextWithQuestions>) => {
    setContextValue((prevValue) => ({ ...prevValue, ...newValue }));
  };

  return (
    <GptContext.Provider
      value={{
        textWithQuestions: contextValue,
        updateContextValue,
      }}
    >
      {children}
    </GptContext.Provider>
  );
};

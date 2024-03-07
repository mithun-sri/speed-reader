import { createContext, useContext, useState } from "react";

interface TutorialContextType {
  stage: number;
  setStage: (stage: number) => void;
}

const TutorialContext = createContext<TutorialContextType>({
  stage: -1,
  setStage: () => {},
});

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error(
      "useTutorialContext must be used within a TutorialContextProvider",
    );
  }
  return context;
}

export function TutorialContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stage, setStage] = useState(-1);

  return (
    <TutorialContext.Provider value={{ stage, setStage }}>
      {children}
    </TutorialContext.Provider>
  );
}

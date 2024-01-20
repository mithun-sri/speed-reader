import { createContext } from 'react';

interface ContextType {
  wpm: number;
  setWPM: (wpm: number) => void;
}

const Context = createContext<ContextType>({ wpm: 0, setWPM: (_) => {} });

export default Context;
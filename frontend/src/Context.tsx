import { createContext } from 'react';

interface ContextType {
  wpm: number
}

const Context = createContext<ContextType>({ wpm: 300 });

export default Context;
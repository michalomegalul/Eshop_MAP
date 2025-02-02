// Add missing imports at the top
import { createContext, useContext, ReactNode, useRef } from 'react';

interface ScrollContextType {
  saveScrollPosition: (path: string) => void;
  restoreScrollPosition: (path: string) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  saveScrollPosition: () => {},
  restoreScrollPosition: () => {}
});

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const positions = useRef<Map<string, number>>(new Map());

  const saveScrollPosition = (path: string) => {
    positions.current.set(path, window.scrollY);
  };

  const restoreScrollPosition = (path: string) => {
    const position = positions.current.get(path) || 0;
    window.scrollTo(0, position);
  };

  return (
    <ScrollContext.Provider value={{ saveScrollPosition, restoreScrollPosition }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
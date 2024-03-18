import React, { createContext, useContext } from 'react';

const HydrationContext = createContext(false);

export function useHydration() {
  const isHydrated = useContext(HydrationContext);
  return isHydrated;
}

export function HydratedProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <HydrationContext.Provider value={hydrated}>
      {children}
    </HydrationContext.Provider>
  );
}
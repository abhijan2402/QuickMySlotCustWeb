import React, { createContext, useContext, useState } from "react";

// Create context with default value null for newLoc
const LocationContext = createContext({
  newLoc: null,
  setNewLoc: () => {},
});

// Context provider component to wrap your app or part of it
export const LocationProvider = ({ children }) => {
  const [newLoc, setNewLoc] = useState(null);

  return (
    <LocationContext.Provider value={{ newLoc, setNewLoc }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the LocationContext conveniently
export const useLocationContext = () => useContext(LocationContext);

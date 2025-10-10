import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext({
  newLoc: null,
  setNewLoc: () => {},
  address: null,
  setAddress: () => {},
});

const DEFAULT_LOCATION = { latitude: 20.5937, longitude: 78.9629 };

export const LocationProvider = ({ children }) => {
  const [newLoc, setNewLoc] = useState(null);
  const [address, setAddress] = useState(null);
  console.log(newLoc);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setNewLoc({ latitude, longitude });
        },
        (error) => {
          console.warn("Geolocation permission denied or unavailable", error);
          setNewLoc(DEFAULT_LOCATION);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setNewLoc(DEFAULT_LOCATION);
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{ newLoc, setNewLoc, address, setAddress }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);

import React, { createContext, useState, useEffect } from "react";

export const CheersContext = createContext();

export const CheersProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [cheers, setCheers] = useState({
    name: "",
    date: null,
    image: null,
    location: { latitude: 30.456954, longitude: -97.635594 },
  });

  const value = {
    loading,
    setLoading,
    cheers,
    setCheers,
  };

  return (
    <CheersContext.Provider value={value}>{children}</CheersContext.Provider>
  );
};

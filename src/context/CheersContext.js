import React, { createContext, useState, useEffect } from "react";

export const CheersContext = createContext();

const defaultCheers = {
  name: "",
  date: new Date(),
  drinkOne: null,
  drinkTwo: null,
  image: null,
  location: null,
};

export const CheersProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [cheerDetail, setCheerDetail] = useState(null);
  const [cheers, setCheers] = useState({
    name: "",
    date: null,
    drinkOne: null,
    drinkTwo: null,
    image: null,
    location: null,
  });
  const resetCheers = () => {
    setCheers(defaultCheers);
  };

  const value = {
    loading,
    setLoading,
    cheers,
    setCheers,
    resetCheers,
    cheerDetail,
    setCheerDetail,
  };

  return (
    <CheersContext.Provider value={value}>{children}</CheersContext.Provider>
  );
};

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
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
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
    ready,
    setReady,
    cheers,
    setCheers,
    resetCheers,
    cheerDetail,
    setCheerDetail,
    edit,
    setEdit,
    editId,
    setEditId,
    isSignedIn,
    setIsSignedIn,
    isGuest,
    setIsGuest,
    user,
    setUser,
  };

  return (
    <CheersContext.Provider value={value}>{children}</CheersContext.Provider>
  );
};

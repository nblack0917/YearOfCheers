import React, { createContext, useState, useEffect } from "react";
import * as firebase from "firebase";

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
  const [cheersDoc, setCheersDoc] = useState("guestCheers");
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [numberOfCheers, setNumberOfCheers] = useState("--");
  const [cheerDetail, setCheerDetail] = useState(null);
  const [drinkList, setDrinkList] = useState(null);
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

  // const getDrinks = async () => {
  //   const drinksRef = await firebase
  //     .firestore()
  //     .collection("drinks")
  //     .doc("drinks");
  //   drinksRef.get().then((doc) => {
  //     setDrinkList(doc.data());
  //     // console.log(doc.data());
  //   });
  // };

  const getCheersCount = async () => {
    let cheersCount = 0;
    const cheersRef = await firebase.firestore().collection(cheersDoc);
    cheersRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          cheersCount++;
        });
      })
      .then(() => {
        setNumberOfCheers(cheersCount);
      });
  };

  const handleToast = () => {
    setTimeout(() => {
      setToast(true);
      // console.log("toast On");
    }, 500);
    setTimeout(() => {
      setToast(false);
      // console.log("toast Off");
    }, 1000);
  };

  useEffect(() => {
    if (isSignedIn) {
      setCheersDoc("cheers");
    }
    if (isGuest) {
      setCheersDoc("guestCheers");
    }
  }, [isSignedIn, isGuest]);
  // useEffect(() => {
  //   getDrinks();
  // }, []);

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
    cheersDoc,
    drinkList,
    numberOfCheers,
    getCheersCount,
    toast,
    setToast,
    handleToast,
  };

  return (
    <CheersContext.Provider value={value}>{children}</CheersContext.Provider>
  );
};

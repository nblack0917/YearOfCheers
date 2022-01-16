import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import AppLoading from "expo-app-loading";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import * as firebase from "firebase";
import "firebase/firestore";

import { FontAwesome5 } from "@expo/vector-icons";

import { CheersContext } from "../../context/CheersContext";
// import { styles } from "../../utils/style";

import {
  useFonts,
  Merienda_400Regular,
  Merienda_700Bold,
} from "@expo-google-fonts/merienda";
// import { set } from "react-native-reanimated";

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#116466" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),
};

export const Home = ({ navigation }) => {
  const {
    isSignedIn,
    setIsSignedIn,
    loading,
    setLoading,
    isGuest,
    setIsGuest,
    getCheersCount,
    toast,
    setToast,
    handleToast,
  } = useContext(CheersContext);

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Cheers saved!",
      text2: "Here's to the next one!",
    });
    setToast(false);
  };

  const handleSignOut = async () => {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        // Signed in
        setIsGuest(false);
        setIsSignedIn(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  let [fontsLoaded, error] = useFonts({
    Merienda_400Regular,
    Merienda_700Bold,
  });

  useEffect(() => {
    getCheersCount();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (toast) {
        showToast();
      }
    }, 250);
  }, [toast]);

  // useEffect(() => {
  //   console.log(toast);
  // }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../images/WineGlasses.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.wrapper}>
          {/* <Text style={styles.mainText}>Year of Cheers</Text> */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("New Cheers")}
          >
            <FontAwesome5 name="glass-cheers" size={18} color="#F4f4f4" />
            <Text style={styles.addNewText}>Add New Cheers</Text>
            <FontAwesome5 name="glass-cheers" size={18} color="#F4f4f4" />
          </TouchableOpacity>
          <StatusBar style="auto" />
        </View>
        <View style={styles.signOutContainer}></View>
        <Toast config={toastConfig} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3531",
    alignItems: "center",
    justifyContent: "center",
    // backgroundImage: URL("./WineGlasses.jpg"),
  },
  wrapper: {
    flex: 3,
    // backgroundColor: "#2c3531",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 25,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "stretch",
    width: "100%",
    height: "100%",
  },
  addButton: {
    flexDirection: "row",
    maxWidth: 350,
    marginTop: 15,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#116466",
    alignItems: "center",
    justifyContent: "center",
  },
  mainText: {
    textAlign: "center",
    color: "#f4f4f4",
    // marginTop: 30,
    marginBottom: 15,
    fontSize: 36,
    fontFamily: "Merienda_400Regular",
  },
  addNewText: {
    textAlign: "center",
    color: "#f4f4f4",
    paddingHorizontal: 10,
    // marginTop: 5,
    fontSize: 18,
  },
  signOutContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signOutText: {
    color: "#f4f4f4",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#2c3531",
    padding: 10,
    borderRadius: 5,
  },
});

import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext } from "react";
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Portal, Modal } from "react-native-paper";
import AppLoading from "expo-app-loading";
import * as firebase from "firebase";
import "firebase/firestore";

import { CheersContext } from "../../context/CheersContext";

import {
  useFonts,
  Merienda_400Regular,
  Merienda_700Bold,
} from "@expo-google-fonts/merienda";

export const SignIn = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  const { isSignedIn, setIsSignedIn, user, setUser, isGuest, setIsGuest } =
    useContext(CheersContext);

  let [fontsLoaded, error] = useFonts({
    Merienda_400Regular,
    Merienda_700Bold,
  });

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleLogin = async (email, password) => {
    setSigningIn(true);
    setLoginError(null);
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        setUser(userCredential.user);
        console.log(userCredential);
        setIsSignedIn(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setLoginError("Invalid email or password.");
      });
    setSigningIn(false);
  };

  const handleGuestSignIn = () => {
    setTimeout(() => {
      setVisible(false);
      setIsGuest(true);
    }, 1000);
    setTimeout(() => {
      setSigningIn(false);
      //   setIsGuest(true);
    }, 1500);
  };

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
          <Text style={styles.mainText}>Year of Cheers</Text>
          <View style={styles.centerContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setVisible(true);
              }}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSigningIn(true);
                setVisible(true);
                handleGuestSignIn();
              }}
            >
              <Text style={styles.buttonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
          {/* <Button
            style={styles.button}
            onPress={() => navigation.navigate("New Cheers")}
            color="#116466"
            title="Add new Cheers"
          /> */}
          {/* <Text>asfddsa</Text>
          {cheers.length > 0 && <Text>{cheers}</Text>} */}
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={styles.modalContainer}
            >
              {signingIn ? (
                <View>
                  <Text
                    style={styles.mainText}
                    // className="signatureFont"
                  >
                    Signing In
                  </Text>
                  <ActivityIndicator size="large" color="#116466" />
                </View>
              ) : (
                <>
                  {loginError && (
                    <Text style={styles.errorText}>{loginError}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    onChangeText={(e) => {
                      setEmail(e);
                    }}
                    value={email}
                    placeholder="Enter Email"
                    keyboardType="email-address"
                  />
                  <View style={{ height: 15 }}></View>
                  <TextInput
                    style={styles.input}
                    onChangeText={(e) => {
                      setPassword(e);
                    }}
                    value={password}
                    placeholder="Enter Password"
                    secureTextEntry={true}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      handleLogin(email, password);
                    }}
                  >
                    <Text style={styles.buttonText}>Sign In</Text>
                  </TouchableOpacity>
                  <Text style={styles.messageText}>
                    If you do not have a login, please sign in as a guest.
                  </Text>
                </>
              )}
            </Modal>
          </Portal>
          <StatusBar style="auto" />
        </View>
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
    flex: 1,
    // backgroundColor: "#2c3531",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 15,
  },
  centerContainer: {
    flex: 1,
    // backgroundColor: "#2c3531",
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: 15,
  },
  modalContainer: {
    // backgroundColor: "white",
    // padding: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 250,
    // width: 200,
    backgroundColor: "#414A49",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  button: {
    maxWidth: 250,
    marginTop: 25,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#116466",
  },
  buttonText: {
    color: "#f4f4f4",
    fontSize: 24,
  },
  mainText: {
    textAlign: "center",
    color: "#f4f4f4",
    marginTop: 30,
    marginBottom: 15,
    fontSize: 36,
    fontFamily: "Merienda_400Regular",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 18,
    // fontFamily: "Merienda_400Regular",
  },
  input: {
    height: 40,
    // margin: 12,
    borderWidth: 1,
    width: "80%",
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    fontSize: 16,
  },
  messageText: {
    color: "#f4f4f4",
    fontSize: 16,
    paddingTop: 10,
  },
});

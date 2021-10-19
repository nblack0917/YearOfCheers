import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, ImageBackground } from "react-native";
import AppLoading from "expo-app-loading";
import * as firebase from "firebase";
import "firebase/firestore";

import { CheersContext } from "../../context/CheersContext";
// import { styles } from "../../utils/style";

import {
  useFonts,
  Merienda_400Regular,
  Merienda_700Bold,
} from "@expo-google-fonts/merienda";
// import { set } from "react-native-reanimated";

export const Home = ({ navigation }) => {
  // const [cheers, setCheers] = useState("");

  // const getCheers = () => {
  //   try {
  //     const cheersRef = firebase.firestore().collection("cheers");
  //     cheersRef.get().then((querySnapshot) => {
  //       // setCheers(querySnapshot.size.toString());
  //       querySnapshot.forEach((doc) => {
  //         setCheers(doc.data().name);
  //       });
  //     });
  //   } catch (error) {
  //     console.log("Error with firestore: ", error);
  //   }
  // };

  let [fontsLoaded, error] = useFonts({
    Merienda_400Regular,
    Merienda_700Bold,
  });

  // useEffect(() => {
  //   getCheers();
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
          <Text style={styles.mainText}>Year of Cheers</Text>
          <Button
            style={styles.button}
            onPress={() => navigation.navigate("New Cheers")}
            color="#116466"
            title="Add new Cheers"
          />
          {/* <Text>asfddsa</Text>
          {cheers.length > 0 && <Text>{cheers}</Text>} */}
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
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  button: {
    maxWidth: 100,
    marginTop: 15,
    padding: 10,
    borderRadius: 20,
  },
  mainText: {
    textAlign: "center",
    color: "#f4f4f4",
    marginTop: 30,
    marginBottom: 15,
    fontSize: 24,
    fontFamily: "Merienda_400Regular",
  },
});

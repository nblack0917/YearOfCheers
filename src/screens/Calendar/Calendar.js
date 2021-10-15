import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button, ImageBackground } from "react-native";
import AppLoading from "expo-app-loading";

import {
  useFonts,
  Merienda_400Regular,
  Merienda_700Bold,
} from "@expo-google-fonts/merienda";

export const Calendar = ({ navigation }) => {
  let [fontsLoaded, error] = useFonts({
    Merienda_400Regular,
    Merienda_700Bold,
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../images/WineGlasses_dark.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.wrapper}>
          <Text style={styles.mainText}>Calendar Page</Text>
          <Button
            style={styles.button}
            onPress={() => navigation.navigate("Home")}
            title="Go to Home"
          />
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
  },
  mainText: {
    textAlign: "center",
    color: "#f4f4f4",
    marginBottom: 15,
    fontSize: 24,
    fontFamily: "Merienda_400Regular",
  },
});

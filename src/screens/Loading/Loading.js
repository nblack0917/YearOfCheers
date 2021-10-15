import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Merienda_400Regular,
  Merienda_700Bold,
} from "@expo-google-fonts/merienda";

export const Loading = ({ navigation }) => {
  let [fontsLoaded, error] = useFonts({
    Merienda_400Regular,
    Merienda_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <View style={[styles.container, styles.horizontal]}>
      <Text
        style={styles.mainText}
        // className="signatureFont"
      >
        Year Of Cheers
      </Text>
      <ActivityIndicator size="large" color="#116466" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3531",
  },
  horizontal: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
  },
  mainText: {
    textAlign: "center",
    color: "#f4f4f4",
    marginBottom: 15,
    fontSize: 24,
    fontFamily: "Merienda_400Regular",
  },
});

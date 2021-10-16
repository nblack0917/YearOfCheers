import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Button, ImageBackground } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as firebase from "firebase";
import apiKeys from "./firebase";

import { Home } from "./screens/Home/Home";
import { AddEditCheers } from "./screens/AddEditCheers/AddEditCheers";
import { Calendar } from "./screens/Calendar/Calendar";
import { CheersMap } from "./screens/CheersMap/CheersMap";
import { Loading } from "./screens/Loading/Loading";

import { CheersProvider } from "./context/CheersContext";

const Drawer = createDrawerNavigator();

const paperTheme = {
  ...DefaultTheme,
  dark: true,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: "black",
    accent: "gray",
  },
};

export default function App() {
  const [loading, setLoading] = useState(true);
  if (!firebase.apps.length) {
    console.log("Connected with Firebase");
    firebase.initializeApp(apiKeys.firebaseConfig);
    setLoading(false);
  }
  if (loading) {
    return <Loading />;
  } else {
    return (
      <CheersProvider>
        <PaperProvider theme={paperTheme}>
          <NavigationContainer>
            <Drawer.Navigator
              initialRouteName="Home"
              screenOptions={{
                drawerActiveBackgroundColor: "#116466",
                drawerContentContainerStyle: { backgroundColor: "#333" },
                drawerActiveTintColor: "#f4f4f4",
                drawerInactiveTintColor: "#D1E8E2",
                drawerInactiveBackgroundColor: "#414A49",
                drawerStyle: {
                  backgroundColor: "#2c3531",
                  width: "80%",
                },
                headerStyle: { backgroundColor: "#414A49" },
                headerTitleStyle: { color: "#f4f4f4" },
                defaultStatus: "open",
              }}
            >
              <Drawer.Screen name="Home" component={Home} />
              <Drawer.Screen name="Cheers" component={AddEditCheers} />
              <Drawer.Screen name="Calendar" component={Calendar} />
              <Drawer.Screen name="CheersMap" component={CheersMap} />
            </Drawer.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </CheersProvider>
    );
  }
}

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
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  button: {
    maxWidth: "100px",
  },
  mainText: {
    textAlign: "center",
  },
});

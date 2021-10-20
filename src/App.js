import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, Button, ImageBackground } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as firebase from "firebase";
import apiKeys from "./firebase";

import { Home } from "./screens/Home/Home";
import { AddEditCheers } from "./screens/AddEditCheers/AddEditCheers";
import { CheersCalendar } from "./screens/Calendar/Calendar";
import { CheersMap } from "./screens/CheersMap/CheersMap";
import { CheersDetail } from "./screens/Detail/Detail";
import { SignIn } from "./screens/SignIn/SignIn";
import { Loading } from "./screens/Loading/Loading";

// import { CheersProvider } from "./context/CheersContext";
import { CheersContext } from "./context/CheersContext";

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

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

const HomePage = () => {
  return (
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
      <Drawer.Screen name="New Cheers" component={AddEditCheers} />
      <Drawer.Screen name="Calendar" component={CheersCalendar} />
      <Drawer.Screen name="Cheers Map" component={CheersMap} />
      {/* <Drawer.Screen name="Cheers Detail" component={CheersDetail} /> */}
    </Drawer.Navigator>
  );
};

export default function AppNav() {
  // const [loading, setLoading] = useState(true);

  const { isSignedIn, setIsSignedIn, loading, setLoading } =
    useContext(CheersContext);

  if (!firebase.apps.length) {
    console.log("Connected with Firebase");
    firebase.initializeApp(apiKeys.firebaseConfig);
    setLoading(false);
  }
  // if (loading) {
  //   return <Loading />;
  // } else {
  return (
    // <CheersProvider>
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <Stack.Navigator>
          {isSignedIn ? (
            <>
              <Stack.Screen
                name="HomePage"
                component={HomePage}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Cheers Detail" component={CheersDetail} />
            </>
          ) : (
            <Stack.Screen
              name="Sign In"
              component={SignIn}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
    // </CheersProvider>
  );
  // }
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

import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  LogBox,
} from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import * as firebase from "firebase";
import apiKeys from "./firebase";

import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Home } from "./screens/Home/Home";
import { AddEditCheers } from "./screens/AddEditCheers/AddEditCheers";
import { CheersCalendar } from "./screens/Calendar/Calendar";
import { CheersMap } from "./screens/CheersMap/CheersMap";
import { CheersDetail } from "./screens/Detail/Detail";
import { SignIn } from "./screens/SignIn/SignIn";
import { About } from "./screens/About/About";
import { Loading } from "./screens/Loading/Loading";

import { DrawerContent } from "./components/navigation/DrawerContent";

// import { CheersProvider } from "./context/CheersContext";
import { CheersContext } from "./context/CheersContext";

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

const { width, height } = Dimensions.get("window");

import {
  useFonts,
  Merienda_400Regular,
  Merienda_700Bold,
} from "@expo-google-fonts/merienda";

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

const NavigationDrawerStructure = ({ navigation }) => {
  // console.log(navigation);
  const toggleDrawer = () => {
    navigation.toggleDrawer();
  };

  return (
    <TouchableOpacity onPress={() => toggleDrawer()}>
      <MaterialCommunityIcons
        name="menu"
        size={32}
        color="#f4f4f4"
        style={{ marginLeft: 15, paddingBottom: 15 }}
      />
    </TouchableOpacity>
  );
};

const HomePage = () => {
  let [fontsLoaded, error] = useFonts({
    Merienda_400Regular,
    Merienda_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerActiveBackgroundColor: "#116466",
        drawerContentContainerStyle: { backgroundColor: "#333" },
        drawerActiveTintColor: "#f4f4f4",
        drawerInactiveTintColor: "#D1E8E2",
        drawerInactiveBackgroundColor: "#414A49",
        drawerStyle: {
          backgroundColor: "#2c3531",
          width: "70%",
        },
        drawerItemStyle: { color: "#f4f4f4" },
        headerLeft: () => <NavigationDrawerStructure navigation={navigation} />,
        headerTitle: "Year of Cheers",
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#2c3531" },
        headerTitleStyle: styles.mainText,
        defaultStatus: "open",
      })}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="New Cheers" component={AddEditCheers} />
      <Drawer.Screen name="Calendar" component={CheersCalendar} />
      <Drawer.Screen name="Cheers Map" component={CheersMap} />
      <Drawer.Screen name="About" component={About} />
    </Drawer.Navigator>
  );
};

export default function AppNav() {
  // const [loading, setLoading] = useState(true);

  const {
    isSignedIn,
    setIsSignedIn,
    loading,
    setLoading,
    isGuest,
    toast,
    setToast,
  } = useContext(CheersContext);

  if (!firebase.apps.length) {
    console.log("Connected with Firebase");
    firebase.initializeApp(apiKeys.firebaseConfig);
    setLoading(false);
  }

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <Stack.Navigator>
          {isSignedIn || isGuest ? (
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
  );
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
    color: "#f4f4f4",
    // marginTop: 30,
    marginBottom: 15,
    fontSize: width > 400 ? 32 : 28,
    fontFamily: "Merienda_400Regular",
  },
});

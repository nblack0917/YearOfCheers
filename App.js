import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Home Page</Text>
      <Button
        onPress={() => navigation.navigate("Cheers")}
        title="Go to Cheers"
      />
      <StatusBar style="auto" />
    </View>
  );
};
const Cheers = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Cheers Page</Text>
      <Button onPress={() => navigation.navigate("Home")} title="Go to Home" />
      <StatusBar style="auto" />
    </View>
  );
};

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        // screenOptions={{
        //   drawerActiveBackgroundColor: "#000",
        //   drawerContentContainerStyle: { backgroundColor: "#333" },
        //   drawerActiveTintColor: "#fff",
        // }}
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Cheers" component={Cheers} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

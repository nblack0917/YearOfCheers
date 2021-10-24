import React, { useContext } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import * as firebase from "firebase";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import { CheersContext } from "../../context/CheersContext";

export function DrawerContent(props) {
  const paperTheme = useTheme();

  const {
    isSignedIn,
    setIsSignedIn,
    loading,
    setLoading,
    isGuest,
    setIsGuest,
  } = useContext(CheersContext);

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

  const logoArray = [
    require("../../images/CheersWine.png"),
    require("../../images/CheersBubbles.png"),
    require("../../images/CheersWhiskey.png"),
  ];

  const pickPhoto = () => {
    let randomNumber = Math.floor(Math.random() * 3);
    // console.log(randomNumber);
    return logoArray[randomNumber];
  };

  //   console.log(pickPhoto());

  //   const { signOut, toggleTheme } = React.useContext(AuthContext);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                width: 200,
                height: 200,
              }}
            >
              <Image source={pickPhoto()} style={{ width: 200, height: 200 }} />
            </View>

            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  80
                </Paragraph>
                <Caption style={styles.caption}>Cheers</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="home-outline"
                  color={props.state.index === 0 ? "#D9B08C" : "#f4f4f4"}
                  size={size}
                />
              )}
              label="Home"
              activeTintColor="#116466"
              activeBackgroundColor="#116466"
              inactiveBackgroundColor="#414A49"
              style={styles.drawerItem}
              labelStyle={{ color: "#ffffff" }}
              activeTintColor="#116466"
              focused={props.state.index === 0}
              onPress={() => {
                props.navigation.navigate("Home");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <FontAwesome5
                  name="glass-cheers"
                  color={props.state.index === 1 ? "#D9B08C" : "#f4f4f4"}
                  size={size}
                />
              )}
              label="New Cheers"
              style={styles.drawerItem}
              activeTintColor="#116466"
              activeBackgroundColor="#116466"
              inactiveBackgroundColor="#414A49"
              style={styles.drawerItem}
              labelStyle={{ color: "#ffffff" }}
              activeTintColor="#116466"
              focused={props.state.index === 1}
              onPress={() => {
                props.navigation.navigate("New Cheers");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <FontAwesome5
                  name="calendar-alt"
                  color={props.state.index === 2 ? "#D9B08C" : "#f4f4f4"}
                  size={size}
                />
              )}
              label="Cheers Calendar"
              style={styles.drawerItem}
              activeTintColor="#116466"
              activeBackgroundColor="#116466"
              inactiveBackgroundColor="#414A49"
              style={styles.drawerItem}
              labelStyle={{ color: "#ffffff" }}
              activeTintColor="#116466"
              focused={props.state.index === 2}
              onPress={() => {
                props.navigation.navigate("Calendar");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <FontAwesome5
                  name="map-marked-alt"
                  color={props.state.index === 3 ? "#D9B08C" : "#f4f4f4"}
                  size={size}
                />
              )}
              label="Cheers Map"
              style={styles.drawerItem}
              activeTintColor="#116466"
              activeBackgroundColor="#116466"
              inactiveBackgroundColor="#414A49"
              style={styles.drawerItem}
              labelStyle={{ color: "#ffffff" }}
              activeTintColor="#116466"
              focused={props.state.index === 3}
              onPress={() => {
                props.navigation.navigate("Cheers Map");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <FontAwesome5
                  name="info-circle"
                  color={props.state.index === 4 ? "#D9B08C" : "#f4f4f4"}
                  size={size}
                />
              )}
              label="About"
              style={styles.drawerItem}
              activeTintColor="#116466"
              activeBackgroundColor="#116466"
              inactiveBackgroundColor="#414A49"
              style={styles.drawerItem}
              labelStyle={{ color: "#ffffff" }}
              activeTintColor="#116466"
              focused={props.state.index === 4}
              //   onPress={() => {
              //     props.navigation.navigate("SupportScreen");
              //   }}
            />
          </Drawer.Section>
          {/* <Drawer.Section title="Preferences">
            <TouchableRipple
            //   onPress={() => {
            //     toggleTheme();
            //   }}
            >
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={paperTheme.dark} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section> */}
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="exit-to-app"
              color={"#f4f4f4"}
              size={size}
            />
          )}
          label="Sign Out"
          labelStyle={{ color: "#ffffff" }}
          onPress={() => {
            handleSignOut();
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: "#2c3531",
  },
  userInfoSection: {
    paddingLeft: 35,
  },
  title: {
    color: "#f4f4f4",
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    color: "#f4f4f4",
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    paddingLeft: 65,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    color: "#f4f4f4",
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#D9B08C",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerItem: {
    // backgroundColor: "#414A49",
    width: "100%",
    marginLeft: 0,
    paddingLeft: 15,
    // marginBottom: 10,
  },
});

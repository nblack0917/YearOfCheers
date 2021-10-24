import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import AppLoading from "expo-app-loading";
import * as Linking from "expo-linking";
import * as firebase from "firebase";
import "firebase/firestore";

import { CheersContext } from "../../context/CheersContext";

const defaultImage = require("../../images/defaultCheers.jpg");

import {
  useFonts,
  Merienda_400Regular,
  Merienda_700Bold,
} from "@expo-google-fonts/merienda";
// import { set } from "react-native-reanimated";

export const About = ({ navigation }) => {
  const {
    isSignedIn,
    setIsSignedIn,
    loading,
    setLoading,
    isGuest,
    setIsGuest,
    getCheersCount,
  } = useContext(CheersContext);

  const handleLinkedIn = () => {
    Linking.openURL("https://www.linkedin.com/in/nick-a-black/");
  };
  const handleGitHub = () => {
    Linking.openURL("https://github.com/nblack0917");
  };

  let [fontsLoaded, error] = useFonts({
    Merienda_400Regular,
    Merienda_700Bold,
  });

  useEffect(() => {
    getCheersCount();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <ImageBackground
          source={require("../../images/WineGlasses_dark.jpg")}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.wrapper}>
            <Text style={styles.mainText}>About the Year of Cheers</Text>
            <Image style={styles.pic} source={defaultImage} />
            <View style={styles.textContainer}>
              <Text style={styles.subText}>
                Cheers! Sláinte! Na zdravi! Prost! Santé! Salud! Lechyd da! Sei
                gesund!
              </Text>
              <Text style={styles.subText}>
                No matter how you say it, we all raise a glass with our friends
                and family when we want to commemorate our time together.
                Everyone cheers’ for different things; whether it’s good health,
                a good day, a special event, or just being around good people.
              </Text>
              <Text style={styles.subText}>
                This application was created for two reasons. First, to give
                guest users a way to record a memory of what they celebrated,
                while also being able to see what others have celebrated.
                Second, it’s also a personal application for my wife and I.
                Since the beginning of our relationship, we’ve created different
                ways to remember all of our fun and wonderful memories. We’ve
                done everything from taking selfies everywhere to collecting
                trinkets and building a shadow box together. This year we will
                raise our glasses to all the things we do and places we go, and
                then record them in this handy application. At the end of the
                year, we’ll have a map and a calendar of our memories.
              </Text>
            </View>
            <View style={{ height: 20 }}></View>
            <Text style={styles.mainText}>About the developer</Text>
            <View style={styles.textContainer}>
              <Text style={styles.subText}>
                My name is Nick Black. Last year I decided to take a career
                change and put myself through coding school. I’ve been working
                in JavaScript, Node.js, and React.js, and React Native, but I
                wanted to gain more experience with React Native. With this
                application, I challenged myself to learn and become proficient
                in that language. In just 2 short weeks, I built a successful
                React Native project from scratch. I am currently a Junior Web
                Developer living in the Austin, Texas, area.
              </Text>
              <Text style={styles.subText}>
                If you would like to reach out to me with questions about this
                application or myself you can find my info in through the
                following links:
              </Text>
              <View style={styles.contactLinks}>
                <View style={styles.contactWrapper}>
                  <TouchableOpacity
                    style={styles.contactLinks}
                    onPress={() => handleLinkedIn()}
                  >
                    <View style={{ width: 60, height: 60 }}>
                      <Image
                        style={styles.contactBadge}
                        source={require("../../images/LI-In-Bug.png")}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.contactLinks}
                    onPress={() => handleLinkedIn()}
                  >
                    <View style={{ width: 60, height: 60 }}>
                      <Image
                        style={styles.contactBadge}
                        source={require("../../images/GitHub-Mark-Light-120px-plus.png")}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <StatusBar style="auto" />
          </View>
          <View style={styles.signOutContainer}></View>
        </ImageBackground>
      </ScrollView>
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
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  textContainer: {
    flex: 1,
    width: "90%",
  },
  contactLinks: {
    flex: 1,
    // flexDirection: "row",
    // width: "100%",
    paddingBottom: 30,
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  contactWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
    fontSize: 24,
    fontFamily: "Merienda_400Regular",
  },
  subText: {
    textAlign: "left",
    color: "#f4f4f4",
    marginVertical: 15,
    fontSize: 18,
    // fontFamily: "Merienda_400Regular",
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
  pic: {
    width: "100%",
    height: 175,
  },
  contactBadge: {
    width: "100%",
    height: 60,
  },
  linkedInBox: {
    flex: 1,
    width: 62,
    height: 62,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

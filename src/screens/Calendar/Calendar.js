import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Calendar } from "react-native-calendars";
import * as firebase from "firebase";
import "firebase/firestore";
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
  FlatList,
} from "react-native";

import { Loading } from "../Loading/Loading";
import { CheersItem } from "./CheersItem";

import { calendarTheme } from "./CalendarTheme";

import {
  useFonts,
  Merienda_400Regular,
  Merienda_700Bold,
} from "@expo-google-fonts/merienda";

export const CheersCalendar = ({ navigation }) => {
  const [cheersLoading, setCheersLoading] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [originDates, setOriginDates] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [clickedDayEvents, setClickedDayEvents] = useState([]);

  let [fontsLoaded, error] = useFonts({
    Merienda_400Regular,
    Merienda_700Bold,
  });

  const formatMonth = (date) => {
    let plusOne = parseInt(date) + 1;
    if (plusOne < 10) {
      return `0${plusOne.toString()}`;
    } else {
      return plusOne.toString();
    }
  };
  const formatDate = (date) => {
    let day = parseInt(date);
    if (day < 10) {
      return `0${day.toString()}`;
    } else {
      return day.toString();
    }
  };

  const fetchDates = async () => {
    let events = {};
    let eventData = [];
    let cheersArray = [];

    const cheersRef = await firebase.firestore().collection("cheers");
    cheersRef
      .get()
      .then((querySnapshot) => {
        setEventsData(querySnapshot);
        querySnapshot.forEach((doc) => {
          let event = doc;
          let formattedDate = `${event
            .data()
            .date.toDate()
            .getFullYear()}-${formatMonth(
            event.data().date.toDate().getMonth()
          )}-${formatDate(event.data().date.toDate().getDate())}`;
          eventData.push(event);
          events = {
            ...events,
            [formattedDate]: {
              marked: true,
              selected: false,
              ...event,
            },
          };
        });
      })
      .then(() => {
        // console.log("events", events)
        setEventsData(eventData);
        setOriginDates(events);
        setMarkedDates(events);
      })
      .then(() => {
        // console.log("event data", eventData)
        setCheersLoading(true);
      })
      .catch((e) => console.log(e));
  };

  const selectDate = (clickedDay) => {
    let newDate = { [clickedDay]: { marked: false, selected: true } };
    let newDates = { ...originDates, ...newDate };
    const formatEventDate = (event) => {
      // console.log(eventsData);
      // console.log("event", event.data());
      // console.log(formatMonth(event.data().date.toDate()));
      return `${event.data().date.toDate().getFullYear()}-${formatMonth(
        event.data().date.toDate().getMonth()
      )}-${formatDate(event.data().date.toDate().getDate())}`;
    };
    // console.log(newDates);
    setMarkedDates(newDates);
    setClickedDayEvents(
      eventsData.filter((event) => formatEventDate(event) === clickedDay)
    );
  };

  useEffect(() => {
    fetchDates();
  }, []);
  // useEffect(() => {
  //   if (markedDates !== {}) {
  //     setCheersLoading(true);
  //     // console.log("markedDates", markedDates);
  //   }
  // }, [markedDates]);

  return !cheersLoading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../images/WineGlasses_dark.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.wrapper}>
          <Text style={styles.mainText}>Calendar Page</Text>
          <Calendar
            current={new Date()}
            enableSwipeMonths={true}
            markedDates={markedDates}
            onDayPress={(day) => {
              let clickedDay = day.dateString;
              // console.log(clickedDay);
              selectDate(clickedDay);
            }}
            // onDayLongPress={(day) => console.log(day)}
            style={{
              borderWidth: 2,
              borderColor: "#2c3531",
              // height: 350,
              width: "100%",
            }}
            theme={calendarTheme}
          />
          {clickedDayEvents.length > 1 &&
            clickedDayEvents.map((event, index) => (
              <CheersItem
                key={Math.random() * 100}
                event={event}
                expanded={false}
              />
            ))}
          {clickedDayEvents.length === 1 && (
            <CheersItem
              event={clickedDayEvents[0]}
              expanded={true}
              navigation={navigation}
            />
          )}
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

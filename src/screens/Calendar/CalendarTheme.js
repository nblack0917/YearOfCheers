import React from "react";
import { Dimensions } from "react-native";
// import { COLOR_GREENISH } from '../../../utils/constants';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const windowWidth = Dimensions.get("window").width;

export const calendarTheme = {
  "stylesheet.calendar.header": {
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: hp(6),
      alignItems: "center",
      backgroundColor: "#414A49",
    },
    monthText: {
      textTransform: "uppercase",
      fontWeight: "normal",
      fontSize: 20,
      //   fontFamily: "Poppins-Regular",
      color: "#f4f4f4",
    },
    dayHeader: {
      marginTop: 2,
      marginBottom: 7,
      width: 50,
      textAlign: "center",
      color: "#D1E8E2",
      backgroundColor: "#414A49",
    },
  },
  "stylesheet.calendar.main": {
    container: {
      paddingLeft: 0,
      paddingRight: 0,
      borderBottomWidth: 1,
      borderColor: "#414A49",
      width: wp(100),
    },
    dayContainer: {
      flex: 1,
      height: 55,
      // width: (windowWidth / 7),
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 0.5,
      borderColor: "#414A49",
    },
    week: {
      marginTop: 0,
      marginBottom: 0,
      flexDirection: "row",
      justifyContent: "space-evenly",
    },
  },
  "stylesheet.day.basic": {
    selected: {
      alignItems: "center",
      justifyContent: "center",
      width: wp(100) / 7 - 2,
      height: 54,
      backgroundColor: "#414A49",
    },
    selectedText: {
      marginTop: 16,
      color: "#f4f4f4",
    },
    text: {
      marginTop: 8,
      color: "black",
      // zIndex: 2000
    },
  },
  "stylesheet.dot": {
    dot: {
      width: wp(2),
      height: wp(2),
      borderRadius: wp(2),
      opacity: 100,
      alignSelf: "center",
      // zIndex: 1000,
    },
  },
  calendarBackground: "#f4f4f4",
  textSectionTitleColor: "#b6c1cd",
  textSectionTitleDisabledColor: "#d9e1e8",
  selectedDayBackgroundColor: "#414A49",
  selectedDayTextColor: "#f4f4f4",
  todayTextColor: "#D9B08C",
  dayTextColor: "#414A49",
  textDisabledColor: "#d9e1e8",
  dotColor: "#116466",
  selectedDotColor: "#f4f4f4",
  arrowColor: "#f4f4f4",
  disabledArrowColor: "#d9e1e8",
  monthTextColor: "#f4f4f4",
  // indicatorColor: 'blue',
  textDayFontWeight: "normal",
  textDayHeaderFontWeight: "normal",
  textDayFontSize: 16,
  textDayHeaderFontSize: 12,
  //   textDayFontFamily: "Poppins-Regular",
  //   textDayHeaderFontFamily: "Poppins-Regular",
};

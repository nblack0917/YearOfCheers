import React, { useState, useEffect, useContext, useRef } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import {
//   TextInput,
//   StyleSheet,
//   Text,
//   View,
//   Button,
//   Image,
//   ImageBackground,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   Platform,
//   Content,
// } from "react-native";

const GOOGLE_PLACES_API_ANDROID = "AIzaSyDLpmfVOiiJ_DvntHbTt71wk9ahaMBeqw4";

const placeRef = useRef();

export const GoogleAutocomplete = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: "YOUR API KEY",
        language: "en",
      }}
    />
  );
};

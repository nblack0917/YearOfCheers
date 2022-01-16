import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext, useRef } from "react";
import MapView, { Marker, ProviderPropType } from "react-native-maps";
import { Portal, Modal } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import ImageView from "react-native-image-viewing";
import uuid from "react-native-uuid";
import * as Location from "expo-location";
import * as firebase from "firebase";
import "firebase/firestore";

import DateTimePicker from "@react-native-community/datetimepicker";
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
} from "react-native";

import { Loading } from "../Loading/Loading";

import { CheersContext } from "../../context/CheersContext";

export const AddEditCheers = ({ navigation }) => {
  // const [ready, setReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [drinkOne, setDrinkOne] = useState();
  const [drinkTwo, setDrinkTwo] = useState();
  // const [date, setDate] = useState(null);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const [region, setRegion] = useState({
    latitude: 30.456954,
    longitude: -97.635594,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [visible, setVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [markers, setMarkers] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    cheers,
    setCheers,
    loading,
    setLoading,
    resetCheers,
    ready,
    setReady,
    edit,
    setEdit,
    editId,
    setEditId,
    cheersDoc,
    getCheersCount,
    setToast,
    handleToast,
  } = useContext(CheersContext);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const mapView = useRef();
  const markerView = useRef();

  const drinkList = [
    "Beer",
    "White Wine",
    "Red Wine",
    "Whiskey",
    "Scotch",
    "Margarita",
    "Sparkling Wine",
    "Water",
    "Bloody Mary",
    "Mimosa",
    "Soda",
    "Other",
  ];

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setCheers({ ...cheers, date: currentDate });
    if (mode === "date") {
      setMode("time");
      setShow(true);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode("date");
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const onRegionChange = (region) => {
    setRegion(region);
  };

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, "0");
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  const pickImage = async () => {
    setUploading(true);
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      } else {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          // aspect: [4, 3],
          quality: 1,
        });
        // console.log(result);
        if (!result.cancelled) {
          // console.log(result);
          setCheers({ ...cheers, image: result.uri });
          uploadFile(result.uri);
          // setVisible(false);
        }
      }
    }
  };

  const takeImage = async () => {
    setUploading(true);
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      } else {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });
        if (!result.cancelled) {
          // console.log(result);
          setCheers({ ...cheers, image: result.uri });
          uploadFile(result.uri);
          // setVisible(false);
        }
      }
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    // console.log(location);
    animateMap({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setMarkers({
      marker: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
    setCheers({
      ...cheers,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
    // setMarkerVisible(true);
  };

  const animateMap = ({ latitude, longitude }, index) => {
    // console.log("latlng", latitude, longitude);
    mapView.current.animateToRegion(
      {
        // Takes a region object as parameter
        longitude,
        latitude,
        latitudeDelta: 0.0363,
        longitudeDelta: 0.0363,
      },
      500
    );
  };

  const uploadFile = async (filePath) => {
    const response = await fetch(filePath);
    const blob = await response.blob();
    var ref = firebase.storage().ref("cheersPhotos").child(uuid.v4());
    ref
      .put(blob)

      .then((snapshot) =>
        ref.getDownloadURL().then((url) => {
          setCheers({ ...cheers, image: url });
          setImage([{ uri: url }]);
        })
      )
      .then(() => {
        console.log("photo updated!");
        setUploading(false);
        setVisible(false);
      })
      .catch((e) => console.log({ message: "Failed to uploaded picture", e }));
    return;
  };

  const checkFields = () => {
    if (!cheers.drinkOne || !cheers.drinkTwo) {
      setCheers({ ...cheers, drinkOne: "Beer", drinkTwo: "Beer" });
    }
    if (!cheers.name) {
      // Alert("Please add a name for this cheers.");
      Alert.alert(
        "Cannot save cheers",
        "Please add a name for this cheers.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      return false;
    } else if (!cheers.location) {
      Alert.alert(
        "Cannot save cheers",
        "Please pick a location for this cheers.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      return false;
    } else {
      return true;
    }
  };

  const uploadCheers = async () => {
    console.log("uploading cheers");
    if (checkFields()) {
      const cheersRef = firebase.firestore().collection(cheersDoc);
      if (edit) {
        await cheersRef
          .doc(editId)
          .update(cheers)
          .then(handleToast())
          .then(resetCheers())
          .then(setEditId(null))
          .then(setEdit(false))
          .then(navigation.navigate("Home"));
      } else {
        await cheersRef
          .add(cheers)
          .then(resetCheers())
          .then(getCheersCount())
          .then(handleToast())
          .then(navigation.navigate("Home"))
          .catch((error) => console.log("Failed to upload", error));
      }
    }
  };

  useEffect(() => {
    if (!ready) {
      setCheers({ ...cheers, date: new Date() });
      setReady(true);
    }
    if (cheers.location) {
      setMarkers({
        marker: {
          latitude: cheers.location.latitude,
          longitude: cheers.location.longitude,
        },
      });
      setRegion({
        latitude: cheers.location.latitude,
        longitude: cheers.location.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      });
    }
    if (cheers.image) {
      setImage([{ uri: cheers.image }]);
    }
    // console.log(drinkList);
  }, [ready]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <ImageBackground
          source={require("../../images/WineGlasses_dark.jpg")}
          resizeMode="cover"
          style={styles.imageContainer}
        >
          <View style={styles.wrapper}>
            <Text style={styles.mainText}>
              {edit ? "Edit" : "Add New"} Cheers
            </Text>
            <Text style={styles.subText}>Cheers:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(e) => {
                setCheers({ ...cheers, name: e });
                // console.log(e);
              }}
              value={cheers.name}
              placeholder="ex. To good times"
            />
            <Text style={styles.subText}>What drinks did you cheers with?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                // style={{ fontSize: 24 }}
                selectedValue={cheers.drinkOne}
                onValueChange={(itemValue, itemIndex) =>
                  setCheers({ ...cheers, drinkOne: itemValue })
                }
              >
                {drinkList.map((drink) => {
                  return (
                    <Picker.Item
                      label={drink}
                      value={drink}
                      key={uuid.v4()}
                      style={{ fontSize: 24 }}
                    />
                  );
                })}
              </Picker>
              <Picker
                style={styles.picker}
                selectedValue={cheers.drinkTwo}
                onValueChange={(itemValue, itemIndex) =>
                  setCheers({ ...cheers, drinkTwo: itemValue })
                }
              >
                {drinkList.map((drink) => {
                  return (
                    <Picker.Item
                      label={drink}
                      value={drink}
                      key={uuid.v4()}
                      style={{ fontSize: 24 }}
                    />
                  );
                })}
              </Picker>
            </View>
            {/* <Text style={styles.subText}>Date:</Text> */}
            {ready && (
              <View style={styles.dateWrapper}>
                <Text style={styles.dateText}>
                  {cheers.date.toDateString()}
                </Text>
                <Text style={styles.dateText}>{formatAMPM(cheers.date)}</Text>
              </View>
            )}
            <View>
              <Button
                onPress={showDatepicker}
                color="#116466"
                title="Change Date/Time"
              />
              <View style={{ height: 50 }}></View>
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={cheers.date}
                mode={mode}
                is24Hour={false}
                display="default"
                onChange={onChange}
              />
            )}
            {/* <Text style={styles.subText}>Location:</Text> */}
            <MapView
              scrollEnabled={true}
              zoomEnabled={true}
              // showsMyLocationButton={true}
              style={{ width: "80%", height: 325, marginBottom: 10 }}
              initialRegion={region}
              onRegionChange={(e) => onRegionChange(e)}
              onPress={(e) => {
                setMarkers({ marker: e.nativeEvent.coordinate });
                setCheers({ ...cheers, location: e.nativeEvent.coordinate });
                animateMap(e.nativeEvent.coordinate);
              }}
              ref={mapView}
            >
              {markers && (
                <Marker
                  title="Cheers"
                  description="Clink"
                  coordinate={markers.marker}
                  ref={markerView}
                />
              )}
            </MapView>
            <Button
              color="#116466"
              title="Use Current location"
              onPress={() => getCurrentLocation()}
            />
            <View style={{ height: 50 }}></View>
            {/* <Text style={styles.subText}>Photo: (optional)</Text> */}
            {cheers.image !== null && (
              <TouchableOpacity
                style={styles.picContainer}
                onPress={() => setImageVisible(true)}
              >
                <Image
                  style={styles.pic}
                  source={{ uri: cheers.image !== null && cheers.image }}
                />
              </TouchableOpacity>
            )}
            <Button
              color="#116466"
              title={cheers.image ? "Replace Image" : "Add an Image (optional)"}
              onPress={() => showModal()}
            />
            <View style={{ height: 50 }} />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => uploadCheers()}
            >
              <Text style={styles.buttonText}>Save Cheers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 15 }}
              onPress={() => {
                setMarkers(null);
                resetCheers();
              }}
            >
              <Text style={styles.subText}>Reset Cheers</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />

            <ImageView
              images={image}
              imageIndex={0}
              visible={imageVisible}
              onRequestClose={() => setImageVisible(false)}
            />

            <Portal>
              <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={styles.modalContainer}
              >
                {uploading ? (
                  <View>
                    <Text style={styles.mainText}>Uploading Image</Text>
                    <ActivityIndicator size="large" color="#116466" />
                  </View>
                ) : (
                  <>
                    <Button
                      style={{ margin: 20 }}
                      title="New Image from Camera"
                      color="#116466"
                      onPress={takeImage}
                    />
                    <View style={{ height: 40 }}></View>
                    <Button
                      style={{ margin: 20 }}
                      title="Select from Camera Roll"
                      color="#116466"
                      onPress={pickImage}
                    />
                  </>
                )}
              </Modal>
            </Portal>

            <StatusBar style="auto" />
          </View>
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
  wrapper: {
    flex: 1,
    // backgroundColor: "#2c3531",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 15,
  },
  dateWrapper: {
    // flex: 3,
    // backgroundColor: "#2c3531",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 15,
    // height: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
    // height: "100%",
  },
  button: {
    maxWidth: 100,
    marginTop: 15,
  },
  modalButton: {
    margin: 20,
  },
  mainText: {
    textAlign: "center",
    color: "#f4f4f4",
    marginBottom: 15,
    fontSize: 24,
    fontFamily: "Merienda_400Regular",
  },
  dateText: {
    textAlign: "center",
    color: "#f4f4f4",
    // marginBottom: 15,
    fontSize: 24,
    fontFamily: "Merienda_400Regular",
  },
  subText: {
    textAlign: "left",
    width: "80%",
    color: "#f4f4f4",
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: "Merienda_400Regular",
  },
  input: {
    height: 40,
    marginBottom: 25,
    borderWidth: 1,
    width: "80%",
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    fontSize: 16,
  },
  modalContainer: {
    // backgroundColor: "white",
    // padding: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    // width: 200,
    backgroundColor: "#414A49",
  },
  picContainer: {
    width: 300,
    height: "auto",
    borderWidth: 2,
    marginBottom: 20,
  },
  pic: {
    width: 298,
    height: 298,
  },
  saveButton: {
    // padding: 5,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D1E8E2",
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "left",
    // width: "70%",
    color: "#333",
    padding: 15,
    fontSize: 24,
    fontFamily: "Merienda_400Regular",
  },
  pickerContainer: {
    // flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginVertical: 25,
    // height: 24,
    // marginBottom: 10,
  },
  picker: {
    width: "80%",
    marginBottom: 25,
    height: 24,
    backgroundColor: "#f4f4f4",
  },
});

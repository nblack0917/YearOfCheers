import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext, useRef } from "react";
import MapView, { Marker, ProviderPropType } from "react-native-maps";
import { Portal, Modal } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import ImageView from "react-native-image-viewing";
import uuid from "react-native-uuid";
import * as Location from "expo-location";
import * as firebase from "firebase";
import "firebase/firestore";

const defaultImage = require("../../images/defaultCheers.jpg");

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

export const CheersDetail = ({ navigation, cheer }) => {
  //   const [ready, setReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  // const [name, setName] = useState("");
  // const [date, setDate] = useState(null);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  // const [image, setImage] = useState(null);
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
  const [image, setImage] = useState(null);

  const {
    cheers,
    setCheers,
    loading,
    setLoading,
    resetCheers,
    cheerDetail,
    ready,
    setReady,
    edit,
    setEdit,
    editId,
    setEditId,
  } = useContext(CheersContext);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const mapView = useRef();
  const markerView = useRef();

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
          allowsEditing: true,
          // aspect: [4, 3],
          quality: 1,
        });
        console.log(result);
        if (!result.cancelled) {
          console.log(result);
          setCheers({ ...cheers, image: result.uri });
          // const fileName = `cheersPhotos/${uuid.v4()}.jpg`;
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
          allowsEditing: true,
          // aspect: [4, 3],
          quality: 1,
        });
        if (!result.cancelled) {
          console.log(result);
          setCheers({ ...cheers, image: result.uri });
          // const fileName = `cheersPhotos/${uuid.v4()};
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
    console.log(location);
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
    console.log("latlng", latitude, longitude);
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
    // console.log("index", index)
    // let selectedMarker = markerView.current;
    // selectedMarker.showCallout();
    // console.log("markerView", selectedMarker)
  };

  const uploadFile = async (filePath) => {
    //console.log('fileName', fileName, filePath);
    // setIsLoading(true);

    const response = await fetch(filePath);
    const blob = await response.blob();
    var ref = firebase.storage().ref("cheersPhotos").child(uuid.v4());
    ref
      .put(blob)

      // const fileRef = firebase.storage().ref(fileName);
      // fileRef
      //   .put(filePath)
      .then((snapshot) =>
        ref.getDownloadURL().then((url) => setCheers({ ...cheers, image: url }))
      )
      .then(() => {
        console.log("photo updated!");
        setUploading(false);
        setVisible(false);
      })
      .catch((e) => console.log({ message: "Failed to uploaded picture", e }));
    // .finally(() => setIsLoading(false));
    return;
  };

  const checkFields = () => {
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
      const cheersRef = firebase.firestore().collection("cheers");
      await cheersRef
        .add(cheers)
        .then(resetCheers())
        .then(navigation.navigate("Home"))
        .catch((error) => console.log("Failed to upload", error));
    }
  };

  const handleEditCheers = () => {
    setReady(true);
    setEdit(true);
    setEditId(cheerDetail.id);
    setCheers({
      name: cheerDetail.data().name,
      date: cheerDetail.data().date.toDate(),
      drinkOne: null,
      drinkTwo: null,
      image: cheerDetail.data().image ? cheerDetail.data().image : "",
      location: cheerDetail.data().location,
    });
    navigation.navigate("New Cheers");
  };

  useEffect(() => {
    if (!ready) {
      setCheers({ ...cheers, date: new Date() });
      setReady(true);
    }
    console.log(cheerDetail);
  }, [ready]);

  useEffect(() => {
    setRegion({
      latitude: cheerDetail.data().location.latitude,
      longitude: cheerDetail.data().location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    if (cheerDetail.data().image) {
      setImage([{ uri: cheerDetail.data().image }]);
    } else {
      setImage([defaultImage]);
    }
  }, []);

  //   if (!cheersDetail) {
  //     return <Loading />;
  //   } else {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <ImageBackground
          source={require("../../images/WineGlasses_dark.jpg")}
          resizeMode="cover"
          style={styles.imageContainer}
        >
          <View style={styles.wrapper}>
            {cheerDetail.data().image ? (
              <TouchableOpacity
                style={styles.picDetailContainer}
                onPress={() => setImageVisible(true)}
              >
                <Image
                  style={styles.pic}
                  source={{
                    uri: cheerDetail.data().image && cheerDetail.data().image,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.picDetailContainer}
                onPress={() => setImageVisible(true)}
              >
                <Image style={styles.pic} source={defaultImage} />
              </TouchableOpacity>
            )}
            {/* <Button
              color="#116466"
              title={cheers.image ? "Replace Image" : "Add an Image"}
              onPress={() => showModal()}
            />
            <Text style={styles.mainText}>Cheers Detail Page</Text>
            <Text style={styles.subText}>Name:</Text> */}
            <Text style={styles.mainText}>{cheerDetail.data().name}</Text>
            {/* <TextInput
              style={styles.input}
              onChangeText={(e) => {
                setCheers({ ...cheers, name: e });
                // console.log(e);
              }}
              value={cheers.name}
              placeholder="Cheers Name"
            /> */}
            {/* <Text style={styles.subText}>Date:</Text> */}
            {ready && (
              <View style={styles.dateWrapper}>
                <Text style={styles.dateText}>
                  {cheerDetail.data().date.toDate().toDateString()}
                </Text>
                <Text style={styles.dateText}>
                  {formatAMPM(cheerDetail.data().date.toDate())}
                </Text>
              </View>
            )}
            <View>
              {/* <Button
                onPress={showDatepicker}
                color="#116466"
                title="Change Date/Time"
              /> */}
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
              scrollEnabled={false}
              rotateEnabled={false}
              zoomEnabled={false}
              // showsMyLocationButton={true}
              style={{
                width: "100%",
                height: 200,
                marginBottom: 10,
                marginTop: 10,
              }}
              initialRegion={region}
              onRegionChange={(e) => onRegionChange(e)}
              //   onPress={(e) => {
              //     setMarkers({ marker: e.nativeEvent.coordinate });
              //     setCheers({ ...cheers, location: e.nativeEvent.coordinate });
              //     animateMap(e.nativeEvent.coordinate);
              //   }}
              ref={mapView}
            >
              <Marker
                title="Cheers"
                description="Clink"
                coordinate={{
                  latitude: cheerDetail.data().location.latitude,
                  longitude: cheerDetail.data().location.longitude,
                }}
                ref={markerView}
              />
            </MapView>
            {/* <Button
              color="#116466"
              title="Use Current location"
              onPress={() => getCurrentLocation()}
            /> */}
            {/* <Text style={styles.subText}>Photo: (optional)</Text> */}

            <View style={{ height: 100 }} />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleEditCheers()}
            >
              <Text style={styles.buttonText}>Edit This Cheers</Text>
            </TouchableOpacity>
            {/* <Button
              style={{ padding: 15 }}
              color="#116466"
              title="Save Cheers"
              onPress={() => uploadCheers()}
            /> */}
            <View style={{ height: 100 }} />

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
                    <Text
                      style={styles.mainText}
                      // className="signatureFont"
                    >
                      Uploading Image
                    </Text>
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
            {/* <Button
            style={styles.button}
            onPress={() => navigation.navigate("Home")}
            title="Go to Home"
          /> */}

            <StatusBar style="auto" />
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
  //   }
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
    // paddingTop: 15,
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
    margin: 12,
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
  picDetailContainer: {
    width: "100%",
    height: "auto",
    // borderWidth: 2,
    marginBottom: 20,
  },
  pic: {
    width: "100%",
    height: 300,
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
});

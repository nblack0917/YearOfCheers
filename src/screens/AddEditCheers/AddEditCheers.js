import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext } from "react";
import MapView, { Marker, ProviderPropType } from "react-native-maps";
import { Portal, Modal } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
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
} from "react-native";

import { CheersContext } from "../../context/CheersContext";

export const AddEditCheers = ({ navigation }) => {
  const [ready, setReady] = useState(false);
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

  const { cheers, setCheers } = useContext(CheersContext);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

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
          setCheers({ ...cheers, image: result.uri });
          setVisible(false);
        }
      }
    }
  };

  const takeImage = async () => {
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
        console.log(result);
        if (!result.cancelled) {
          setCheers({ ...cheers, image: result.uri });
          setVisible(false);
        }
      }
    }
  };

  useEffect(() => {
    if (!ready) {
      setCheers({ ...cheers, date: new Date() });
      setReady(true);
    }
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
            <Text style={styles.mainText}>Add/Edit Cheers Page</Text>
            <Text style={styles.subText}>Name:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(e) => {
                setCheers({ ...cheers, name: e });
                // console.log(e);
              }}
              value={cheers.name}
              placeholder="Cheers Name"
            />
            <Text style={styles.subText}>Date:</Text>
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
            <Text style={styles.subText}>Location:</Text>
            <MapView
              style={{ width: "80%", height: 325 }}
              region={region}
              onRegionChange={(e) => onRegionChange(e)}
            >
              <Marker
                title="This is a title"
                description="This is a description"
                coordinate={{ latitude: 30.456954, longitude: -97.635594 }}
              />
            </MapView>
            <Text style={styles.subText}>Photo:</Text>
            {cheers.image !== null && (
              <View style={styles.picContainer}>
                <Image
                  style={styles.pic}
                  source={{ uri: cheers.image !== null && cheers.image }}
                />
              </View>
            )}
            <Button
              color="#116466"
              title="Upload an Image"
              onPress={() => showModal()}
            />
            <View style={{ height: 100 }} />

            <Portal>
              <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={styles.modalContainer}
              >
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
    width: "70%",
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
    width: "70%",
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
});

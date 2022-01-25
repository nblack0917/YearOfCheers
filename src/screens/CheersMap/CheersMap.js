import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext, useRef } from "react";
import MapView, { Marker, ProviderPropType } from "react-native-maps";
import * as Location from "expo-location";
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

import { CheersContext } from "../../context/CheersContext";
import { makeUrl } from "expo-linking";

export const CheersMap = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 30.456954,
    longitude: -97.635594,
    latitudeDelta: 0.6,
    longitudeDelta: 0.3,
  });
  const [markers, setMarkers] = useState(null);
  const [allMarkers, setAllMarkers] = useState(null);
  const [cheersLoading, setCheersLoading] = useState(false);

  const {
    cheers,
    setCheers,
    loading,
    setLoading,
    resetCheers,
    cheerDetail,
    setCheerDetail,
    edit,
    cheersDoc,
  } = useContext(CheersContext);

  const mapView = useRef();
  const markerView = useRef(new Array());

  const onRegionChange = (region) => {
    setRegion(region);
  };

  const animateMap = ({ latitude, longitude }, index) => {
    // console.log("latlng", latitude, longitude);
    mapView.current.animateToRegion(
      {
        // Takes a region object as parameter
        longitude,
        latitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      },
      500
    );
    let selectedMarker = markerView.current[index];
    selectedMarker.showCallout();
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    // console.log(location);
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.6,
      longitudeDelta: 0.3,
    });
    // setMarkerVisible(true);
  };

  const handleDetail = (item) => {
    setCheerDetail(item);
    navigation.navigate("Cheers Detail");
  };

  const getCheers = async () => {
    let cheersArray = [];
    const cheersRef = await firebase.firestore().collection(cheersDoc);
    cheersRef
      .get()
      .then((querySnapshot) => {
        // setCheers(querySnapshot.size.toString());
        querySnapshot.forEach((doc) => {
          cheersArray.push(doc);
          // console.log(cheersArray);
        });
      })
      .then(() => {
        const sortedCheers = cheersArray.sort(
          (a, b) => a.data().date.toDate() - b.data().date.toDate()
        );
        setMarkers(cheersArray);
        setLoading(false);
        getCurrentLocation();
        // console.log(cheersArray);
      });
    // console.log(markers);
  };

  const Item = ({ item, index }) => (
    <View style={styles.hr}>
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => animateMap(item.data().location, index)}
      >
        <View style={styles.listItemRow}>
          <View style={styles.listItemCol}>
            <Text style={styles.scheduleProblem}>
              {item.data().date.toDate().toDateString()}
            </Text>
            <Text style={styles.address}>{item.data().name}</Text>
          </View>
          <View style={styles.listItemButton}>
            <Button
              onPress={() => handleDetail(item)}
              title="Details"
              color="#116466"
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <Item item={item} index={index} mapView={mapView} />
  );

  const formateMarkerDate = (date) => {
    console.log(date);
    const d = new Date(date);
    console.log(d);
    return d.toDateString();
  };

  const fitAllMarkers = () => {
    const DEFAULT_PADDING = { top: 10, right: 10, bottom: 10, left: 10 };

    mapView.current.fitToCoordinates(allMarkers, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  };

  useEffect(() => {
    if (!edit) {
      setLoading(true);
      getCheers();
    }
  }, [edit]);
  useEffect(() => {
    if (markers) {
      setCheersLoading(true);
      // console.log("markers", markers);
      setAllMarkers(
        markers.map((marker, index) => {
          // console.log("mark");
          return {
            name: marker.data().name,
            key: marker.data().name + index,
            latitude: marker.data().location.latitude,
            longitude: marker.data().location.longitude,
          };
        })
      );
    }
  }, [markers]);

  useEffect(() => {
    // console.log("MapView", mapView);
    if (cheersLoading) {
      if (mapView.current) {
        setTimeout(() => {
          fitAllMarkers();
        }, 250);
      }
    }
  }, [cheersLoading]);

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
          {/* <Text style={styles.mainText}>Cheers Map Page</Text> */}
          <MapView
            scrollEnabled={true}
            zoomEnabled={true}
            // showsMyLocationButton={true}
            style={{ width: "100%", height: 300, marginBottom: 10 }}
            initialRegion={region}
            onRegionChange={(e) => onRegionChange(e)}
            ref={mapView}
          >
            {markers &&
              markers.map((marker, index) => {
                return (
                  <Marker
                    title={marker.data().name}
                    description={marker.data().date.toDate().toDateString()}
                    key={marker.data().name + index}
                    ref={(ref) => markerView.current.push(ref)}
                    coordinate={marker.data().location}
                  />
                );
              })}
            {/* {markers && (
              <Marker
                title="Cheers"
                description="Clink"
                coordinate={markers.marker}
                ref={markerView}
              />
            )} */}
          </MapView>
          <View style={styles.listContainer}>
            <FlatList
              data={markers}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.data().name}`}
              onRefresh={() => {
                getCheers();
              }}
              refreshing={false}
            />
          </View>
          {/* <Button
            style={styles.button}
            onPress={() => navigation.navigate("Home")}
            title="Go to Home"
          /> */}
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
  listContainer: {
    flex: 1,
    width: "100%",
    paddingLeft: 20,
    marginTop: 10,
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
  hr: {
    marginVertical: 10,
    borderBottomColor: "#D9B08C",
    borderBottomWidth: 1,
    flex: 1,
    width: "95%",
    flexDirection: "row",
    // backgroundColor: 'silver',
    justifyContent: "center",
  },
  address: {
    flexWrap: "wrap",
    fontSize: 16,
    flex: 1,
    textAlign: "left",
    paddingTop: 10,
    color: "#D1E8E2",
  },
  scheduleProblem: {
    flex: 1,
    width: "100%",
    fontSize: 16,
    color: "#D1E8E2",
    textAlign: "left",
    // backgroundColor: "green"
  },
  listItem: {
    flex: 1,
    width: "95%",
    flexDirection: "row",
    // backgroundColor: 'silver',
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: "center",
  },
  listItemRow: {
    flex: 1,
    // paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "blue"
  },
  listItemCol: {
    flex: 1,
    // paddingVertical: 20,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // backgroundColor: "blue"
  },
});

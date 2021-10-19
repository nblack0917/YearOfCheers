import React, { useState, useEffect, useContext, useRef } from "react";
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

const Item = ({ item, index }) => (
  <View style={styles.hr}>
    {/* <TouchableOpacity style={styles.listItem}> */}
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => animateMap(item.location, index)}
    >
      <View style={styles.listItemRow}>
        <View style={styles.listItemCol}>
          {/* <Text style={styles.title}>{item.first_name} {item.last_name}</Text> */}
          <Text style={styles.scheduleProblem}>
            {item.date.toDate().toDateString()}
          </Text>
          <Text style={styles.address}>{item.name}</Text>
        </View>
        <View style={styles.listItemButton}>
          <Button
            //   onPress={() => handleDetail(item)}
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

export const CheersList = ({ markers, mapView }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={markers}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.name}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingLeft: 20,
    marginTop: 10,
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
  listItemButton: {
    flex: 0.35,
    width: 50,
    paddingLeft: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    // backgroundColor: "blue"
  },
  title: {
    fontSize: 18,
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
  hr: {
    marginVertical: 10,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    flex: 1,
    width: "95%",
    flexDirection: "row",
    // backgroundColor: 'silver',
    justifyContent: "center",
  },
});

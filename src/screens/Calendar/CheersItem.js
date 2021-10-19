import React, { useContext } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

// import { Button } from "react-native-elements";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { CheersContext } from "../../context/CheersContext";

export const CheersItem = ({ navigation, event, expanded }) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  const handlePress = () => setIsExpanded(!isExpanded);

  const { cheerDetail, setCheerDetail } = useContext(CheersContext);

  return (
    <>
      <View style={styles.accordionContainer}>
        <View style={styles.detailsContainer}>
          <Text style={styles.eventHeader}>
            {event.data().date.toDate().toDateString()}
          </Text>
          <Text style={styles.eventHeader}>{event.data().name}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={{ margin: 20 }}
            title="View Cheers"
            color="#116466"
            onPress={() => {
              setCheerDetail(event);
              navigation.navigate("Cheers Detail");
            }}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    width: wp(100),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#414A49",
    marginTop: 15,
    // borderBottomWidth: 1,
    // borderColor: "#d9e1e8",
  },
  detailsContainer: {
    width: wp(68),
  },
  eventHeader: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  // icon: {
  //     color: 'white',
  //     fontSize: 14,
  //     width: '100%',
  // },
  cityTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 4,
    paddingRight: 40,
  },
  cityTimeText: {
    color: "white",
    fontSize: 16,
  },
  // locationText: {
  //     paddingLeft: 10,
  //     color: "#414A49",
  // },
  // descriptionText: {
  //     paddingHorizontal: 10,
  //     paddingVertical: 12,
  // },
  buttonContainer: {
    width: wp(28),
    justifyContent: "center",
  },
  buttonStyle: {
    // borderColor: "grey",
    borderRadius: 10,
    // borderWidth: 1,
    width: "100%",
    backgroundColor: "white",
  },
});

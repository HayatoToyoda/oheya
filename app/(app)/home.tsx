import * as React from "react";
import { Image, StyleSheet, View } from "react-native";

const Home = () => {
  return (
    <View style={styles.home}>
      <Image style={styles.homeChild} resizeMode="cover" source={require('../../assets/images/user.png')} />
      <View style={[styles.rectangleParent, styles.rectangleLayout]}>
        <View style={styles.groupChild} />
        <View style={[styles.groupItem, styles.groupLayout]} />
        <View style={[styles.groupInner, styles.groupLayout]} />
      </View>
      <View style={[styles.rectangleParent, styles.rectangleLayout]}>
        <View style={styles.groupChild} />
        <View style={[styles.groupItem, styles.groupLayout]} />
        <View style={[styles.groupInner, styles.groupLayout]} />
      </View>
      <View style={[styles.rectangleContainer, styles.rectangleLayout]}>
        <View style={styles.groupChild} />
        <View style={[styles.groupItem, styles.groupLayout]} />
        <View style={[styles.groupInner, styles.groupLayout]} />
      </View>
      <View style={[styles.groupView, styles.rectangleLayout]}>
        <View style={styles.groupChild} />
        <View style={[styles.groupItem, styles.groupLayout]} />
        <View style={[styles.groupInner, styles.groupLayout]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rectangleLayout: {
    height: 150,
    width: 350,
    left: 20,
    position: "absolute"
  },
  groupLayout: {
    height: 149,
    width: 150,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    backgroundColor: "#d9d9d9",
    position: "absolute"
  },
  homeChild: {
    top: 83,
    left: 70,
    width: 250,
    height: 250,
    position: "absolute"
  },
  groupChild: {
    width: 149,
    height: 148,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    backgroundColor: "#d9d9d9",
    left: 0,
    top: 1,
    position: "absolute"
  },
  groupItem: {
    left: 0,
    top: 1,
    height: 149,
    width: 150
  },
  groupInner: {
    top: 0,
    left: 200
  },
  rectangleParent: {
    top: 346
  },
  rectangleContainer: {
    top: 546
  },
  groupView: {
    top: 746
  },
  home: {
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    height: 844,
    overflow: "hidden"
  }
});

export default Home;

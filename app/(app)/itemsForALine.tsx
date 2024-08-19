import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";

const ItemsForALine = () => {
  return (
    <View style={styles.itemsForALine}>
      <View style={[styles.rectangleParent, styles.rectangleLayout]}>
        <View style={styles.frameChild} />
        <Image style={styles.frameItem} resizeMode="cover" />
        <View style={styles.rectangleGroup}>
          <View style={[styles.groupChild, styles.groupLayout]} />
          <View style={[styles.groupItem, styles.groupLayout]} />
          <View style={[styles.groupInner, styles.groupLayout]} />
        </View>
        <Text style={[styles.descriptionForPost, styles.nameTypo]}>Description for post</Text>
        <Text style={[styles.name, styles.nameTypo]}>Name</Text>
      </View>
      <View style={[styles.rectangleContainer, styles.rectangleLayout]}>
        <View style={styles.frameChild} />
        <Image style={styles.frameItem} resizeMode="cover" />
        <View style={styles.rectangleGroup}>
          <View style={[styles.groupChild, styles.groupLayout]} />
          <View style={[styles.groupItem, styles.groupLayout]} />
          <View style={[styles.groupInner, styles.groupLayout]} />
        </View>
        <Text style={[styles.descriptionForPost, styles.nameTypo]}>Description for post</Text>
        <Text style={[styles.name, styles.nameTypo]}>Name</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rectangleLayout: {
    height: 444,
    width: 380,
    position: "absolute",
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  groupLayout: {
    width: 32,
    backgroundColor: "#d9d9d9",
    height: 32,
    top: 0,
    position: "absolute",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid"
  },
  nameTypo: {
    textAlign: "left",
    color: "#000",
    fontFamily: "Inter-Regular",
    fontSize: 12,
    position: "absolute"
  },
  frameChild: {
    top: 71,
    height: 300,
    left: 0,
    width: 380,
    position: "absolute",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid"
  },
  frameItem: {
    width: 40,
    height: 40,
    top: 0,
    left: 0,
    position: "absolute"
  },
  groupChild: {
    left: 0
  },
  groupItem: {
    left: 47
  },
  groupInner: {
    left: 94
  },
  rectangleGroup: {
    top: 384,
    width: 126,
    height: 32,
    left: 0,
    position: "absolute"
  },
  descriptionForPost: {
    top: 429,
    left: 0
  },
  name: {
    top: 12,
    left: 54
  },
  rectangleParent: {
    top: 81,
    left: 5
  },
  rectangleContainer: {
    marginLeft: -190,
    top: 564,
    left: "50%"
  },
  itemsForALine: {
    flex: 1,
    width: "100%",
    height: 844,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    backgroundColor: "#fff"
  }
});

export default ItemsForALine;

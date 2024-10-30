import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Content = () => {
  return (
    <View style={styles.container}>
      <Text>콘텐츠 내용입니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Content;

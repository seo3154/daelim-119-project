// components/MarketOverview.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MarketOverview = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>시장 개요</Text>
      <Text>다우존스 33,800.60 ▲ 201.80 (0.60%)</Text>
      <Text>나스닥 13,900.19 ▲ 130.70 (0.95%)</Text>
      <Text>SP500 4,280.15 ▲ 40.10 (0.94%)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MarketOverview;

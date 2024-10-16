// components/NewsFeed.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const newsItems = [
  {
    id: "1",
    title: "Apple announces new iPhone",
    summary: "The latest iPhone model comes with...",
  },
  {
    id: "2",
    title: "Tesla shares surge",
    summary: "After a successful quarter, Tesla...",
  },
];

const NewsFeed = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>최신 뉴스</Text>
      <FlatList
        data={newsItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.newsItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.summary}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  newsItem: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NewsFeed;

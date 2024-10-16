// components/StockSearch.tsx
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const StockSearch = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="주식 검색"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="검색" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
  },
});

export default StockSearch;

import React, { useState } from "react";
import { View, TextInput, Text, FlatList, StyleSheet } from "react-native";

const data = [
  { id: 1, title: "Мэдээ 1", content: "Энэ бол анхны мэдээ" },
  { id: 2, title: "Мэдээ 2", content: "Хоёр дахь мэдээний агуулга" },
  { id: 3, title: "Спорт мэдээ", content: "Спортын шинэ мэдээлэл" },
];

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  // Фильтер хийх функц
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Хайлт хийх..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

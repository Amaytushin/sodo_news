import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  

  // Backend-ээс мэдээлэл авах
  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "search_news" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.resultCode === 200) {
          console.log("📦 Ирсэн нийт мэдээ:", data.data.length);
          setItems(data.data);
        }
      })
      .catch((err) => console.log("❌ Алдаа:", err));
  }, []);

  // Фильтер хийх
  const filteredData = items.filter((item) => {
    const title = item.news_title || "";
    const content = item.content || "";
    const huraangvi = item.huraangvi || "";

    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      huraangvi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Тодорхой үгийг highlight хийх функц
  const highlightText = (text, highlight) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <Text key={index} style={styles.highlight}>
          {part}
        </Text>
      ) : (
        <Text key={index}>{part}</Text>
      )
    );
  };

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
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              router.push({
                pathname: "/detail/[id]",
                params: { id: item.nid },
              });
            }}
          >
            <View style={styles.card}>
              <Text style={styles.title}>
                {highlightText(item.news_title || "", searchTerm)}
              </Text>
              <Text> {highlightText(item.content || "", searchTerm)}</Text>
              <Text> {highlightText(item.huraangvi || "", searchTerm)}</Text>
            </View>
          </TouchableOpacity>
        )}
        initialNumToRender={20} // ✨ Эхэнд харуулах элементүүдийн тоо
        maxToRenderPerBatch={20} // ✨ Scroll хийхэд нэмж ачаалах дээд хэмжээ
        windowSize={10} // ✨ Scroll хийхэд ашиглах range
        removeClippedSubviews={false} // ✨ Clip хийгдэхгүй бол илүү олон элемент харуулна
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
    borderColor: "#F0E1F5",
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
  highlight: {
    backgroundColor: "#F0E1F5", // ✨ Гэгээлэг чирнээлэн ягаан өнгө
    fontWeight: "bold",
    color: "#9B4D96", // ✨ Ягаан өнгийн текст
  },
    cardd: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 16,
    width: 260,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
});

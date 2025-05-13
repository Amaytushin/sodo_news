import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "search_news" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.resultCode === 200) {
          setItems(data.data);
        }
      })
      .catch((err) => console.log("❌ Алдаа:", err));
  }, []);

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
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9b59b6"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.input}
          placeholder="Хайлт хийх..."
          placeholderTextColor="#c084f5"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/detail/[id]",
                params: { id: item.nid },
              })
            }
          >
            <Text style={styles.title}>
              {highlightText(item.news_title || "", searchTerm)}
            </Text>
            <Text style={styles.content}>
              {highlightText(item.content || "", searchTerm)}
            </Text>
            <Text style={styles.summary}>
              {highlightText(item.huraangvi || "", searchTerm)}
            </Text>
          </TouchableOpacity>
        )}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fdf6ff", // зөөлөн цайвар violet background
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e056fd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    shadowColor: "#e056fd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#6c3483",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#9b59b6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: "#e056fd",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
    color: "#9b59b6",
  },
  content: {
    marginBottom: 4,
    color: "#555",
  },
  summary: {
    color: "#777",
  },
  highlight: {
    backgroundColor: "#f5d0ff",
    fontWeight: "bold",
    color: "#9b59b6",
  },
});

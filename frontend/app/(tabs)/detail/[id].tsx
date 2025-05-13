import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const NewsDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getnews" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.resultCode === 200) {
          setItems(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const item = items?.find((e) => e.nid == id);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8e44ad" />
        <Text style={styles.loadingText}>Уншиж байна...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Мэдээлэл олдсонгүй.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.gradient}
        />

        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.overlayTitle}>{item.news_title}</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.content}>{item.content}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9fc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
  },
  imageContainer: {
    width: screenWidth,
    height: 250,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    height: 80,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 30 : 50,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 50,
  },
  overlayTitle: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  contentContainer: {
    backgroundColor: "#fff",
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    elevation: Platform.OS === "android" ? 4 : 0,
  },
  content: {
    fontSize: 16,
    color: "#444",
    lineHeight: 26,
  },
});

export default NewsDetailScreen;

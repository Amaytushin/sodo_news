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
  Platform,Pressable
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
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
    backgroundColor: "#f2f4f8",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#7f8c8d",
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    fontWeight: "600",
  },
  imageContainer: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.5, // өндөр нь дэлгэцийн өргөнөөс хамааралтай
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    alignSelf: "center", // Зургийг төвлөрүүлнэ
    borderRadius: 16, // Зөөлөн булантай болгоно
    shadowColor: "#000", // Сүүдэр
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6, // Android дээр сүүдэр
  },

  gradient: {
    position: "absolute",
    bottom: 0,
    height: 100,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 30 : 50,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
  },
  overlayTitle: {
    position: "absolute",
    bottom: 23,
    left: 20,
    right: 20,
    fontSize: 26,
    color: "#ffffff",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  contentContainer: {
    backgroundColor: "#ffffff",
    marginTop: -20, // өмнө нь -12 байсан
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 12,
    elevation: Platform.OS === "android" ? 5 : 0,
  },
  content: {
    fontSize: 17,
    color: "#2c3e50",
    lineHeight: 28,
    letterSpacing: 0.3,
  },
});

export default NewsDetailScreen;

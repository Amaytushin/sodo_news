import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Easing,
  TextInput,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimatedView } from "react-native-reanimated/lib/typescript/component/View";

import { useRouter } from "expo-router";
const { width } = Dimensions.get("window");

const ad = {
  id: 1,
  image: "https://media.tenor.com/ZZFQEc-67xYAAAAM/surprised-sorprendido.gif",
  text: "🎉 Emart цочир хямдрал 9999₮ 🎉",
};

const StarRating = ({ rating, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.starContainer}>
      {stars.map((star) => (
        <TouchableOpacity key={star} onPress={() => onRatingChange(star)}>
          <Text style={star <= rating ? styles.filledStar : styles.emptyStar}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const calculateAverageRating = (ratings) => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return sum / ratings.length;
};

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [cat, setcat] = useState([]);
  const [usdRate, setUsdRate] = useState("Loading...");
  const translateX = useRef(new Animated.Value(width)).current;
  const [token, setToken] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [result, setRelust] = useState(null);
  const router = useRouter();

  // const search = async () => {
  //   try{
  //     const response = await fetch ()
  //   }
  // }

  useEffect(() => {
    const fetchToken = async () => {
      const t = await AsyncStorage.getItem("token");
      setToken(t);
    };
    fetchToken();
  }, []);

  
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
      })
      .catch((err) => console.log(err));

    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getcategory" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.resultCode == 200) {
          setcat(data.data);
          console.log(`cat: ${data.data}`);
        }
      })
      .catch((err) => console.log(err));

    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        setUsdRate(`USD rate: ${data.rates.MNT}₮`);
      })
      .catch((err) => console.log(err));

    startScrolling();
  }, []);

  const startScrolling = () => {
    translateX.setValue(width);
    Animated.timing(translateX, {
      toValue: -width,
      duration: 12000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      startScrolling();
    });
  };

  const handleRatingChange = (itemId, newRating) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const updatedRatings = item.ratings
          ? [...item.ratings, newRating]
          : [newRating];
        return { ...item, ratings: updatedRatings };
      }
      return item;
    });
    setItems(updatedItems);
  };

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/736x/e5/50/f4/e550f43df6534b6132b77c8e9f0ca585.jpg",
      }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView style={styles.container}>
        <LinearGradient colors={["#9b59b6", "#e056fd"]} style={styles.header}>
          <ImageBackground
            source={{
              uri: "https://i.pinimg.com/736x/56/8a/1e/568a1e3f59ef753f658dfd7f6194c798.jpg",
            }}
            style={StyleSheet.absoluteFill}
            imageStyle={{ opacity: 0 }}
          />
          <View style={styles.headerLeftContainer} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>SodoNews</Text>
            <Text style={styles.infoText}>{usdRate}</Text>
          </View>
          <View style={styles.headerRightContainer}>
            {token == null && (
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/LoginScreen")}
                  style={styles.headerButton}
                >
                  <Text style={styles.headerButtonText}>Нэвтрэх</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/RegisterScreen")}
                  style={styles.headerButton}
                >
                  <Text style={styles.headerButtonText}>Бүртгүүлэх</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={styles.adContainer}>
          <Animated.View
            style={[styles.adContent, { transform: [{ translateX }] }]}
          >
            <Image source={{ uri: ad.image }} style={styles.adImage} />
            <Text style={styles.adText}>{ad.text}</Text>
          </Animated.View>
        </View>

        <Text style={styles.sectionTitle}>Улс төрийн мэдээ</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 1)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
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
              <ImageBackground
                source={{
                  uri: item.image_url || "https://via.placeholder.com/300x180",
                }}
                style={styles.cardImage}
                imageStyle={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "transparent"]}
                  style={styles.imageOverlay}
                />
              </ImageBackground>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.news_title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.huraangvi}
                </Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) =>
                    handleRatingChange(item.id, rating)
                  }
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.sectionTitle}>Урлаг соёл</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 2)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/NewsDetailScreen?id=${item.id}`)}
            >
              <ImageBackground
                source={{
                  uri: item.image_url || "https://via.placeholder.com/300x180",
                }}
                style={styles.cardImage}
                imageStyle={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "transparent"]}
                  style={styles.imageOverlay}
                />
              </ImageBackground>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.news_title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.huraangvi}
                </Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) =>
                    handleRatingChange(item.id, rating)
                  }
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.sectionTitle}>Эдийн засаг</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 3)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/NewsDetailScreen?id=${item.id}`)}
            >
              <ImageBackground
                source={{
                  uri: item.image_url || "https://via.placeholder.com/300x180",
                }}
                style={styles.cardImage}
                imageStyle={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "transparent"]}
                  style={styles.imageOverlay}
                />
              </ImageBackground>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.news_title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.huraangvi}
                </Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) =>
                    handleRatingChange(item.id, rating)
                  }
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.sectionTitle}>Нийгэм</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 4)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/NewsDetailScreen?id=${item.id}`)}
            >
              <ImageBackground
                source={{
                  uri: item.image_url || "https://via.placeholder.com/300x180",
                }}
                style={styles.cardImage}
                imageStyle={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "transparent"]}
                  style={styles.imageOverlay}
                />
              </ImageBackground>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.news_title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.huraangvi}
                </Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) =>
                    handleRatingChange(item.id, rating)
                  }
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.sectionTitle}>Спорт</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 5)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/NewsDetailScreen?id=${item.id}`)}
            >
              <ImageBackground
                source={{
                  uri: item.image_url || "https://via.placeholder.com/300x180",
                }}
                style={styles.cardImage}
                imageStyle={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "transparent"]}
                  style={styles.imageOverlay}
                />
              </ImageBackground>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.news_title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.huraangvi}
                </Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) =>
                    handleRatingChange(item.id, rating)
                  }
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.sectionTitle}>Технологи</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 6)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/NewsDetailScreen?id=${item.id}`)}
            >
              <ImageBackground
                source={{
                  uri: item.image_url || "https://via.placeholder.com/300x180",
                }}
                style={styles.cardImage}
                imageStyle={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "transparent"]}
                  style={styles.imageOverlay}
                />
              </ImageBackground>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.news_title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.huraangvi}
                </Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) =>
                    handleRatingChange(item.id, rating)
                  }
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.sectionTitle}>Дэлхий дахинд</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 7)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/NewsDetailScreen?id=${item.id}`)}
            >
              <ImageBackground
                source={{
                  uri: item.image_url || "https://via.placeholder.com/300x180",
                }}
                style={styles.cardImage}
                imageStyle={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "transparent"]}
                  style={styles.imageOverlay}
                />
              </ImageBackground>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.news_title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.huraangvi}
                </Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) =>
                    handleRatingChange(item.id, rating)
                  }
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.sectionTitle}>Боловсрол</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 8)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/NewsDetailScreen?id=${item.id}`)}
            >
              <ImageBackground
                source={{
                  uri: item.image_url || "https://via.placeholder.com/300x180",
                }}
                style={styles.cardImage}
                imageStyle={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "transparent"]}
                  style={styles.imageOverlay}
                />
              </ImageBackground>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.news_title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.huraangvi}
                </Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) =>
                    handleRatingChange(item.id, rating)
                  }
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.sectionTitle}>Эрүүл мэнд</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 9)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/NewsDetailScreen?id=${item.id}`)}
            >
              <ImageBackground
                source={{
                  uri: item.image_url || "https://via.placeholder.com/300x180",
                }}
                style={styles.cardImage}
                imageStyle={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "transparent"]}
                  style={styles.imageOverlay}
                />
              </ImageBackground>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.news_title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.huraangvi}
                </Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) =>
                    handleRatingChange(item.id, rating)
                  }
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.sectionTitle}>Соёл уламжлал</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 10)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/NewsDetailScreen?id=${item.id}`)}
            >
              <ImageBackground
                source={{
                  uri: item.image_url || "https://via.placeholder.com/300x180",
                }}
                style={styles.cardImage}
                imageStyle={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "transparent"]}
                  style={styles.imageOverlay}
                />
              </ImageBackground>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.news_title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.huraangvi}
                </Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) =>
                    handleRatingChange(item.id, rating)
                  }
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  sidePanel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "70%",
    backgroundColor: "transparent",
    zIndex: 999,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeftContainer: { flexDirection: "row", alignItems: "center" },
  headerTextContainer: { flex: 1, alignItems: "center" },
  headerText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  infoText: { color: "#e0e0e0", marginTop: 4, fontSize: 13 },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerButtons: { flexDirection: "row", gap: 8 },
  headerButton: {
    backgroundColor: "#ffffff33",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    minWidth: 100,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  adContainer: {
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "center",
    marginTop: 10,
    overflow: "hidden",
    paddingHorizontal: 10,
  },
  adContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adImage: {
    width: 45,
    height: 45,
    marginRight: 10,
    borderRadius: 8,
  },
  adText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  card: {
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
  cardImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: { padding: 12 },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  cardDescription: { fontSize: 13, color: "#777", lineHeight: 18 },
  cardRating: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#f1c40f",
    marginTop: 6,
  },
  starContainer: { flexDirection: "row", marginTop: 6, gap: 4 },
  filledStar: { color: "#f1c40f", fontSize: 18 },
  emptyStar: { color: "#ccc", fontSize: 18 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 14,
    marginTop: 20,
    marginBottom: 8,
    textDecorationLine: "none",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});

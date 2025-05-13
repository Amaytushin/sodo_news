// HomeScreen.tsx

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
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";

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
  const [usdRate, setUsdRate] = useState("Loading...");
  const [token, setToken] = useState<string | null>(null);
  const translateX = useRef(new Animated.Value(width)).current;
  
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
  const storedEmail = localStorage.getItem("email");
  if (storedEmail) {
    setEmail(storedEmail);
  }
}, []);
  // Хоёр panel-ийн төлөв
  const searchPanelAnim = useRef(new Animated.Value(-width)).current;
  const profilePanelAnim = useRef(new Animated.Value(width)).current;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const toggleSearchPanel = () => {
    if (isSearchVisible) {
      Animated.timing(searchPanelAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsSearchVisible(false));
    } else {
      setIsSearchVisible(true);
      Animated.timing(searchPanelAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleProfilePanel = () => {
    if (isProfileVisible) {
      Animated.timing(profilePanelAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsProfileVisible(false));
    } else {
      setIsProfileVisible(true);
      Animated.timing(profilePanelAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeAllPanels = () => {
    if (isSearchVisible) {
      Animated.timing(searchPanelAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsSearchVisible(false));
    }
    if (isProfileVisible) {
      Animated.timing(profilePanelAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsProfileVisible(false));
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const t = await AsyncStorage.getItem("token");
      setToken(t);
    };
    fetchToken();

    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getnews" }),
    })
      .then((res) => res.json())
      .then((data) => data.resultCode === 200 && setItems(data.data))
      .catch(console.log);

    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        setUsdRate(`USD rate: ${data.rates.MNT}₮`);
      })
      .catch(console.log);

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
      {(isSearchVisible || isProfileVisible) && (
        <TouchableWithoutFeedback onPress={closeAllPanels}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* 🔍 Search Panel */}
      <Animated.View
        style={[
          styles.sidePanel,
          { transform: [{ translateX: searchPanelAnim }] },
        ]}
      >

        <ImageBackground
          source={{
            uri: "https://i.pinimg.com/736x/dd/d9/c6/ddd9c66350a75ebab6a587c09592d4e4.jpg",
          }}
          style={styles.sidePanelBackground}
          >
          <Text style={styles.searchHeader}>🔍 Хайлт</Text>
          <TextInput placeholder="Мэдээ хайх..." style={styles.searchInput} />









          <TouchableOpacity onPress={closeAllPanels} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </ImageBackground>
      </Animated.View>

      {/* 👤 Profile Panel */}
      <Animated.View
        style={[
          styles.sidePanel,
          {
            right: 0,
            position: "absolute",
            transform: [{ translateX: profilePanelAnim }],
          },
        ]}
      >
        <ImageBackground
          source={{
            uri: "https://i.pinimg.com/736x/56/4a/f1/564af10f06689e733b685c3ee0192f52.jpg",
          }}
          style={styles.sidePanelBackground}
          imageStyle={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}
        >
          <TouchableOpacity onPress={closeAllPanels} style={styles.closeButton}>
            <Ionicons name="close" size={26} color="white" />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <View style={styles.profileCard}>
              <Image
                source={{
                  uri: "https://i.pinimg.com/736x/91/29/20/9129206728f2d87fba809749099803c7.jpg",
                }}
                style={styles.avatar}
              />
              <Text style={styles.profileName}>Email: {email || "Хэрэглэгч алга"} </Text>
              {/* <Text style={styles.profileEmail}>
                Email: amay_iin_ireeduin_ehner@gmail.com
              </Text> */}

              <TouchableOpacity
                onPress={() => {
                  AsyncStorage.removeItem("token");
                  closeAllPanels();
                  router.replace("/(tabs)/LoginiiDaraah");
                }}
              >
                <LinearGradient
                  colors={["#9b59b6", "#e056fd"]}
                  style={styles.logoutButton}
                >
                  <Text style={styles.logoutText}>Гарах</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>

      <ScrollView style={styles.container}>
        <LinearGradient colors={["#9b59b6", "#e056fd"]} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>ꌗꂦꀸꂦ ꈤꍟꅏꌗ</Text>
            <Text style={styles.infoText}>{usdRate}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={toggleProfilePanel}
              style={styles.iconBtn}
            >
              <Ionicons name="person-circle-outline" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleSearchPanel}
              style={styles.iconBtn}
            >
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
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
              onPress={() =>
                router.push(`../(tabs)/detail/NewsDetailScreen?id=${item.id}`)
              }
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
  container: { flex: 1, backgroundColor: "transparent" },
  header: {
    padding: 20,
    paddingTop: 60, // Илүү өндөр байрлал
    borderBottomLeftRadius: 30, // Илүү дугуйралсан булан
    borderBottomRightRadius: 30, // Илүү дугуйралсан булан
    backgroundColor: "#2c3e50", // Гүн хөх өнгө
    elevation: 12, // Илүү том сүүдэр
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#34495e", // Сүүдэр нэмэх
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  headerLeft: { flex: 1 },

  headerText: {
    color: "#fff", // Цагаан өнгө
    fontSize: 30, // Илүү том гарчиг
    fontWeight: "bold",
    letterSpacing: 1, // Үсгийн хооронд зай
    textAlign: "center", // Төвлөрүүлсэн байрлал
  },

  infoText: {
    color: "#fff9", // Зөөлөн саарал
    marginTop: 6, // Тэмдэглэл дээр илүү том зай
    fontSize: 14, // Тогтвортой хэмжээ
    textAlign: "center", // Төвлөрүүлсэн байрлал
  },

  headerRight: {
    flexDirection: "row",
    gap: 12, // Илүү том зай
    alignItems: "center", // Бүх элементийн байрлал
  },

  iconBtn: {
    padding: 7, // Илүү том товч
    //backgroundColor: "#e74c3c", // Улаан өнгө
    borderRadius: 8, // Дугуйтал булан
    shadowColor: "#2c3e50", // Сүүдэр нэмэх
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  adContainer: {
    height: 70, // Илүү өндөр
    justifyContent: "center",
    marginTop: 12, // Багахан зай
    overflow: "hidden",
    paddingHorizontal: 20, // Зөв зай нэмэх
    //backgroundColor: "#34495e", // Хөнгөн гүн хөх өнгө
    borderRadius: 12, // Булан дугуйруулах
  },

  adContent: {
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adImage: { width: 45, height: 45, marginRight: 10, borderRadius: 8 },
  adText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  sectionTitle: {
    fontSize: 28, // Төмөр хөтлөгчийн хэмжээг нэмэх
    fontWeight: "100", // Илүү хүчтэй, анхаарал татахуйц харагдах
    color: "#f39c12", // Цайвар алтлаг өнгө, хүндэтгэлтэй, сонирхолтой
    marginLeft: 1, // Илүү их зай
    marginTop: 24, // Урд хэсгээс бага зэрэг зай
    marginBottom: 15, // Илүү том зайтай
    letterSpacing: 1, // Үсгийн хооронд нэмэлт зай нэмэх
    textTransform: "uppercase", // Бүх үсгийг томруулах
    fontFamily: "Poppins", // Modern, сүүлийн үеийн шрифт
    lineHeight: 36, // Хажуугийн зайг нэмэх
    textAlign: "center", // Төвлөрсөн байрлал, илүү тодорхой
    paddingRight: 18, // Баруун тийш бага зэрэг зай нэмэх
    backgroundColor: "#8e44ad", // Илүү тод харагдах өнгө
    paddingVertical: 12, // Дээд ба доод зайг нэмэх
    borderRadius: 8, // Дугуйт булан үүсгэх
    shadowColor: "#2c3e50", // Бараан сүүдэр нэмэх
    shadowOffset: { width: 0, height: 4 }, // Сүүдрийн байрлалыг тохируулах
    shadowOpacity: 0.25, // Сүүдрийн тодрол
    shadowRadius: 3.5, // Сүүдрийн хэмжээ
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 16,
    width: 260,
    elevation: 6,
  },
  cardImage: { width: "100%", height: 150 },
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
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sidePanel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "70%",
    backgroundColor: "transparent",
    zIndex: 999,
  },
  sidePanelBackground: {
    flex: 1,
    padding: 10,
    justifyContent: "flex-start",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 998,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  searchHeader: {
    fontSize: 20, // Илүү том гарчиг
    fontWeight: "800", // Хүчтэй, анхаарал татахуйц
    color: "#34495e", // Бараан хөх өнгө, мэргэжлийн
    marginBottom: 12, // Томхон зай
    textAlign: "center", // Төвлөрүүлсэн байрлал
  },

  searchInput: {
    height: 45, // Өндрийг нэмэх, илүү том
    borderColor: "#ddd", // Зөөлөн саарал өнгө
    borderWidth: 1.5, // Хүрээний өргөнийг нэмэх
    paddingHorizontal: 16, // Илүү том дотор тал
    borderRadius: 10, // Илүү дугуйралсан булан
    backgroundColor: "#f9f9f9", // Зөөлөн саарал фон
    shadowColor: "#2c3e50", // Сүүдэр нэмэх
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20, // Илүү том зай
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20, // Илүү зайтай байрлах
    //backgroundColor: "#2c3e50", // Гүн хөх өнгө, харагдах орчин үеийн фон
    paddingHorizontal: 20, // Зүүн болон баруун талаас багахан зай
  },

  avatar: {
    width: 100, // Илүү том зураг
    height: 100,
    borderRadius: 60, // Дугуй зураг
    borderWidth: 3, // Илүү тод хүрээ
    borderColor: "#ecf0f1", // Хөнгөн саарал өнгийн хүрээ
    marginBottom: 10, // Илүү том зай
    shadowColor: "#2c3e50", // Сүүдэр нэмэх
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  profileName: {
    fontSize: 18, // Илүү том нэр
    fontWeight: "900", // Бат бөх, анхаарал татахуйц
    color: "#ecf0f1", // Хөнгөн саарал өнгө, хөнгөн
    marginBottom: 6, // Илүү том зай
    textAlign: "center", // Төвлөрүүлсэн
  },

  profileEmail: {
    fontSize: 16, // Өнгөрсөн шиг багахан хэмжээ
    color: "#ecf0f1", // Илүү зөөлөн саарал өнгө
    marginBottom: 15, // Томхон зай
    textAlign: "center", // Төвлөрүүлсэн
  },

  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 40, // Илүү өргөн товчлуур
    borderRadius: 30, // Дугуйт булан
    backgroundColor: "#e74c3c", // Улаан өнгө, анхаарал татахуйц
    elevation: 6, // Илүү том сүүдэр
    shadowColor: "#2c3e50", // Сүүдэр нэмэх
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  logoutText: {
    color: "#fff", // Цагаан текст
    fontSize: 18, // Илүү том текст
    fontWeight: "bold", // Бат бөх текст
    textAlign: "center", // Төвлөрүүлсэн
  },
});

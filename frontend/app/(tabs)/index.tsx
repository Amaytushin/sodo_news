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
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const ad = {
  id: 1,
  image:
    "https://pa1.narvii.com/6328/88107ddc2df7a4c4d0f6fa5d92975b4cabc79673_hq.gif",
  text: "Тэнгисийн эргийн охид залуучууд хоорондоо секс хийдэг үү?",
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
  const [cat, setCat] = useState([]);
  const [usdRate, setUsdRate] = useState("Loading...");
  const [token, setToken] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const translateX = useRef(new Animated.Value(width)).current;
  const profilePanelAnim = useRef(new Animated.Value(width)).current;
  const panelOpacity = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const fetchToken = async () => {
      const t = await AsyncStorage.getItem("token");
      setToken(t);
    };
    fetchToken();
  }, [pathName]);

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
      .catch(console.error);

    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getcategory" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.resultCode === 200) setCat(data.data);
      })
      .catch(console.error);

    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        setUsdRate(`USD rate: ${data.rates.MNT}₮`);
      })
      .catch(console.error);

    startScrolling();
  }, []);

  const startScrolling = () => {
    translateX.setValue(width);
    Animated.timing(translateX, {
      toValue: -width,
      duration: 12000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(startScrolling);
  };

  const handleRatingChange = (nid, newRating) => {
    const updatedItems = items.map((item) => {
      if (item.nid === nid) {
        const updatedRatings = item.ratings
          ? [...item.ratings, newRating]
          : [newRating];
        return { ...item, ratings: updatedRatings };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const toggleProfilePanel = () => {
    const toValue = isProfileOpen ? width : width * 0.3;
    setProfileOpen(!isProfileOpen);

    Animated.parallel([
      Animated.timing(profilePanelAnim, {
        toValue,
        duration: 400,
        useNativeDriver: false,
        easing: Easing.out(Easing.poly(4)),
      }),
      Animated.timing(panelOpacity, {
        toValue: isProfileOpen ? 0 : 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    router.push("/");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/736x/e5/50/f4/e550f43df6534b6132b77c8e9f0ca585.jpg",
      }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient colors={["#9b59b6", "#e056fd"]} style={styles.header}>
        <View style={styles.headerLeftContainer} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>SodoNews</Text>
          <Text style={styles.infoText}>{usdRate}</Text>
        </View>
        <View style={styles.headerRightContainer}>
          {token == null ? (
            <>
              <TouchableOpacity
                onPress={() => router.push("../LoginScreen")}
                style={styles.headerButton}
              >
                <Text style={styles.headerButtonText}>Нэвтрэх</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("../RegisterScreen")}
                style={styles.headerButton}
              >
                <Text style={styles.headerButtonText}>Бүртгүүлэх</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.headerButton}
              >
                <Text style={styles.headerButtonText}>Гарах</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("../add_news")}
                style={styles.headerButton}
              >
                <Ionicons name="duplicate-outline" size={31} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleProfilePanel}>
                <Ionicons
                  name="person-circle-outline"
                  size={32}
                  color="white"
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </LinearGradient>

      <Animated.View
        style={[
          styles.profilePanel,
          {
            right: profilePanelAnim,
            opacity: panelOpacity,
            shadowColor: "#000",
            shadowOffset: { width: -4, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
          },
        ]}
      >
        <View style={styles.profileContent}>
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: "https://i.pinimg.com/originals/98/a7/6a/98a76a7097ebaa46044ca332e1db1c6d.gif",
              }}
              style={styles.avatar}
            />
            <Text style={styles.profileTitle}>Сайн байна уу</Text>
          </View>
          <Text style={styles.profileItem}>👤 Нэр: Хэрэглэгч</Text>
          <Text style={styles.profileItem}>📧 И-мэйл: user@example.com</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleProfilePanel}
          >
            <Text style={styles.closeButtonText}>✖ Хаах</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.container}>
        <View style={styles.adContainer}>
          <Animated.View
            style={[styles.adContent, { transform: [{ translateX }] }]}
          >
            <Image source={{ uri: ad.image }} style={styles.adImage} />
            <Text style={styles.adText}>{ad.text}</Text>
          </Animated.View>
        </View>

        <Text style={styles.sectionTitle}>Спорт</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 5)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
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
                    handleRatingChange(item.nid, rating)
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
                    handleRatingChange(item.nid, rating)
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
                    handleRatingChange(item.nid, rating)
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
                    handleRatingChange(item.nid, rating)
                  }
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text style={styles.sectionTitle}>Улс төр</Text>

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
                  pathname: "../detail/[id]",
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
                    handleRatingChange(item.nid, rating)
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
                    handleRatingChange(item.nid, rating)
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
                    handleRatingChange(item.nid, rating)
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
                    handleRatingChange(item.nid, rating)
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
                    handleRatingChange(item.nid, rating)
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
                    handleRatingChange(item.nid, rating)
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
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeftContainer: { flexDirection: "row", alignItems: "center" },
  headerTextContainer: { flex: 1, alignItems: "center" },
  headerText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  infoText: { color: "#e0e0e0", marginTop: 4, fontSize: 14 },
  headerRightContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  headerButton: {
    //backgroundColor: "#ffffff33",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  headerButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  adContainer: {
    height: 60,
    justifyContent: "center",
    marginTop: 10,
    overflow: "hidden",
    paddingHorizontal: 10,
  },
  adContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  adImage: { width: 45, height: 45, marginRight: 10, borderRadius: 8 },
  adText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 14,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 16,
    width: 260,
    elevation: 6,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
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
  profilePanel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "70%",
    zIndex: 999,
    padding: 20,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    backdropFilter: "blur(10px)", // iOS only; Android дэмжихгүй
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#9b59b6",
  },
  profileContent: { flex: 1 },
  profileTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  profileItem: { fontSize: 16, marginBottom: 10 },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#9b59b6",
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});

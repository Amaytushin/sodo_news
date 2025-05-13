import React, { useState, useEffect, useRef } from "react";
import * as DocumentPicker from "expo-document-picker";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
  View,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Provider as PaperProvider,
  Menu,
  DefaultTheme,
  MD3DarkTheme,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [huraangvi, setHuraangvi] = useState("");
  const [categoryName, setCategoryName] = useState({});
  const [catArray, setCatArray] = useState<string[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isNightMode, setIsNightMode] = useState(false);
  const [hadgalah, setHadgalah] = useState(false);

  // Animated value for smooth transition
  const animatedValue = useRef(new Animated.Value(0)).current;

  const theme = isNightMode ? MD3DarkTheme : DefaultTheme;

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets.length > 0) {
      setFile(result.assets[0]);
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getcategory" }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCatArray(data.data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleSubmit = async () => {
    setHadgalah(true);
    const formData = new FormData();

    if (file) {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      formData.append("image_url", blob, file.name);
    }

    formData.append("action", "add_news");
    formData.append("news_title", title);
    formData.append("content", content);
    formData.append("huraangvi", huraangvi);
    formData.append("category_id", categoryName.catid);

    try {
      const res = await fetch("http://127.0.0.1:8000/user/", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      console.log(json);
      Alert.alert("Амжилттай!", "Мэдээлэл хадгалагдлаа");

      setTitle("");
      setContent("");
      setHuraangvi("");
      setCategoryName({});
      setFile(null);
      setHadgalah(false);
      setSuccessMessage("Амжилттай бүртгэгдлээ!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.log(err);
      Alert.alert("Алдаа", "Сервертэй холбогдож чадсангүй");
      setHadgalah(false);
    }
  };

  // Toggle theme with smooth transition
  const toggleTheme = () => {
    setIsNightMode(!isNightMode);

    Animated.timing(animatedValue, {
      toValue: isNightMode ? 0 : 1,
      duration: 600,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const interpolatedBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ffffff", "#121212"],
  });

  const interpolatedTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#333333", "#e0e0e0"], // Softer text color for night mode
  });

  const interpolatedButtonColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#9b59b6", "#8e44ad"],
  });

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={[
            styles.animatedContainer,
            { backgroundColor: interpolatedBackgroundColor },
          ]}
        >
          <ScrollView contentContainerStyle={styles.container}>
            {/* Title */}
            <TextInput
              label="Гарчиг"
              value={title}
              onChangeText={setTitle}
              style={[styles.input, { color: interpolatedTextColor }]}
              mode="outlined"
            />

            {/* Хураангуй */}
            <TextInput
              label="Хураангуй"
              value={huraangvi}
              onChangeText={setHuraangvi}
              style={[styles.input, { color: interpolatedTextColor }]}
              mode="outlined"
            />

            {/* Агуулга */}
            <TextInput
              label="Агуулга"
              value={content}
              onChangeText={setContent}
              style={[styles.input, { color: interpolatedTextColor }]}
              multiline
              numberOfLines={5}
              mode="outlined"
            />

            {/* Категори сонгох */}
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                  <TextInput
                    label="Төрөл сонгох"
                    value={categoryName.catname || ""}
                    style={[styles.input, { color: interpolatedTextColor }]}
                    mode="outlined"
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
              }
            >
              {catArray.map((cat) => (
                <Menu.Item
                  key={cat.cat_id}
                  onPress={() => {
                    setCategoryName({
                      catid: cat.cat_id,
                      catname: cat.category_name,
                    });
                    setMenuVisible(false);
                  }}
                  title={cat.category_name}
                />
              ))}
            </Menu>

            {/* Зураг сонгох */}
            <LinearGradient
              colors={["#9b59b6", "#e056fd"]}
              style={styles.gradientButton}
            >
              <Button
                icon="image"
                mode="contained"
                onPress={pickFile}
                textColor="#fff"
                style={{ backgroundColor: "transparent" }}
              >
                Зураг сонгох
              </Button>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 5,
                  color: interpolatedTextColor,
                }}
              >
                {file ? file.name : ""}
              </Text>
            </LinearGradient>

            {/* Хадгалах */}
            <LinearGradient
              colors={["#9b59b6", "#e056fd"]}
              style={styles.gradientButton}
            >
              <Button
                mode="contained"
                onPress={handleSubmit}
                textColor="#fff"
                disabled={hadgalah}
                style={{ backgroundColor: "transparent" }}
              >
                {hadgalah ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
            </LinearGradient>

            {/* Амжилттай мессеж */}
            {successMessage ? (
              <Text
                style={{
                  color: "#2ecc71", // Илүү тод ногоон
                  marginTop: 10,
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "bold",
                  backgroundColor: "#ecf0f1", // Зөөлөн цайвар фон
                  padding: 10,
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                  elevation: 5, // Android дээр сүүдэр
                }}
              >
                {successMessage}
              </Text>
            ) : null}

            {/* Night Mode Toggle */}
            <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
              <Animated.Text
                style={[styles.toggleText, { color: interpolatedTextColor }]}
              >
                {isNightMode ? "🌙" : "🌞"}
              </Animated.Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Цэвэр цайвар өнгө, dark mode-д автоматаар солих боломжтой
  },
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  input: {
    marginBottom: 16,
    //backgroundColor: "#ffffffcc", // translucent white
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  gradientButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 18,
    padding: 2,
    shadowColor: "#9b59b6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  toggleButton: {
    marginTop: 35,
    alignSelf: "center",
    //backgroundColor: "#ffffff88", // translucent toggle bg
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  toggleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6c5ce7",
  },
});

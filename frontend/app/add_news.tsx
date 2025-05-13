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
  ImageBackground,
} from "react-native";
import {
  TextInput as PaperTextInput,
  Button,
  Text,
  Provider as PaperProvider,
  Menu,
  DefaultTheme,
  MD3DarkTheme,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedTextInput = Animated.createAnimatedComponent(PaperTextInput);

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

  const toggleTheme = () => {
    setIsNightMode(!isNightMode);
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isNightMode ? 1 : 0,
      duration: 600,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isNightMode]);

  const interpolatedBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f8f9fa", "#121212"],
  });
  const interpolatedTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#1c1c1c", "#e0e0e0"],
  });
  const interpolatedInputBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ffffff", "#1e1e1e"],
  });
  const interpolatedButtonColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#9b59b6", "#e056fd"],
  });

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={{
            uri: "https://i.pinimg.com/736x/e5/50/f4/e550f43df6534b6132b77c8e9f0ca585.jpg",
          }}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <Animated.View
            style={[styles.animatedContainer, { backgroundColor: interpolatedBackgroundColor, opacity: 0.93 }]}
          >
            <ScrollView contentContainerStyle={styles.container}>
              {[{
                label: "Гарчиг",
                value: title,
                onChange: setTitle,
              }, {
                label: "Хураангуй",
                value: huraangvi,
                onChange: setHuraangvi,
              }, {
                label: "Агуулга",
                value: content,
                onChange: setContent,
                multiline: true,
                numberOfLines: 5,
              }].map((item, index) => (
                <AnimatedTextInput
                  key={index}
                  label={item.label}
                  value={item.value}
                  onChangeText={item.onChange}
                  mode="outlined"
                  multiline={item.multiline}
                  numberOfLines={item.numberOfLines}
                  style={[styles.input, {
                    backgroundColor: interpolatedInputBackgroundColor,
                    color: interpolatedTextColor,
                  }]}
                  theme={{
                    colors: {
                      text: isNightMode ? "#f5f5f5" : "#000000",
                      placeholder: isNightMode ? "#aaaaaa" : "#666666",
                    },
                  }}
                />
              ))}

              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <AnimatedTextInput
                      label="Төрөл сонгох"
                      value={categoryName.catname || ""}
                      mode="outlined"
                      editable={false}
                      pointerEvents="none"
                      style={[styles.input, {
                        backgroundColor: interpolatedInputBackgroundColor,
                        color: interpolatedTextColor,
                      }]}
                      theme={{
                        colors: {
                          text: isNightMode ? "#f5f5f5" : "#000000",
                          placeholder: isNightMode ? "#aaaaaa" : "#666666",
                        },
                      }}
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

              <LinearGradient
                colors={["#9b59b6", "#e056fd"]}
                style={[styles.gradientButton, { backgroundColor: interpolatedButtonColor }]}
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
              </LinearGradient>
              {file && (
                <Text style={[styles.fileNameText, { color: interpolatedTextColor }]}>{file.name}</Text>
              )}

              <LinearGradient
                colors={["#9b59b6", "#e056fd"]}
                style={[styles.gradientButton, { backgroundColor: interpolatedButtonColor }]}
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

              {successMessage ? (
                <Text style={styles.successMessage}>{successMessage}</Text>
              ) : null}

              <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
                <Animated.Text style={[styles.toggleText, { color: interpolatedTextColor }]}> 
                  {isNightMode ? "🌙" : "🌞"}
                </Animated.Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
    backgroundColor: '#f1f3f6',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
    borderRadius: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  input: {
    marginBottom: 40,
    borderRadius: 16,
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  gradientButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 24,
    padding: 2,
    elevation: 6,
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fileNameText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 15,
    fontStyle: 'italic',
  },
  successMessage: {
    color: '#27ae60',
    backgroundColor: 'rgba(39, 174, 96, 0.15)',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    padding: 12,
    borderRadius: 12,
    borderColor: '#27ae60',
    borderWidth: 1,
  },
  toggleButton: {
    marginTop: 40,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    //backgroundColor: '#ecf0f1',
    borderRadius: 30,
    shadowColor: '#bdc3c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  toggleText: {
    fontSize: 22,
    fontWeight: '700',
  },
});
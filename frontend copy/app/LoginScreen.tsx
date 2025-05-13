import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { router, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [medee, setMedee] = useState("");

  
  const handleLogin = async () => {
      console.log('data')

    const form = {
      action: "login",
      email: email,
      password: password,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json(); // response-ийг json болгож хөрвүүлэх
      console.log(data)
      if (data.resultCode === 200) {
        const email = data.action[0].email;
        if (email) {
          localStorage.setItem("email", email);
          alert('amjiltta')
          router.push("/(tabs)");
        }
        await AsyncStorage.setItem("token", "бүртгэлтэй"); // await ашиглан token хадгална
        router.replace("/"); // Шилжих
      } else {
        console.log(data);
        return;
      }
    } catch (error) {
      console.error("Алдаа гарлаа:", error); // Алдааг барих
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo хэсэг */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/sodonews2.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Input талбарууд */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Имэйл/Утасны дугаар"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Нууц үг"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Forgot password */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity>
          <Text style={styles.optionText}>Нууц үг мартсан?</Text>
        </TouchableOpacity>
      </View>

      {/* Login товч */}
      <TouchableOpacity
  onPress={() => {
    handleLogin(); // ← () нэмэх шаардлагатай
  }}
  style={styles.buttonContainer}
>

        <LinearGradient
          colors={["#9b59b6", "#e056fd"]}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.buttonText}>Нэвтрэх</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Register холбоос */}
      <TouchableOpacity onPress={() => router.push("/RegisterScreen")}>
        <Text style={styles.registerText}>Бүртгүүлэх</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logoImage: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: "#9b59b6",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "bold",
    color: "#5d3fd3",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginBottom: 20,
  },
  optionText: {
    color: "#555",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    color: "#5d3fd3",
    marginTop: 10,
    fontSize: 16,
  },
});

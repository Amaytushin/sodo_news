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
import { router } from "expo-router";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  const handleRegister = () => {
    if (repassword !== password) {
      alert("Нууц үг таарахгүй байна");
      return;
    }

    const form = {
      action: "register",
      email: email,
      password: password,
    };

    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        setSuccessMessage("Амжилттай бүртгэгдлээ!"); // Show success message
        setEmail("");
        setPassword("");
        setrePassword("");

        console.log(data);
        // if (data.resultCode === 200) {
        // }
      })
      .catch((error) => console.error("Алдаа гарлаа:", error));
  };

  return (
    <View style={styles.container}>
      {/* Logo хэсэг */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/sodonews2.png")}
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
        <TextInput
          style={styles.input}
          placeholder="Нууц үг давтах"
          placeholderTextColor="#999"
          secureTextEntry
          value={repassword}
          onChangeText={setrePassword}
        />
      </View>

      {/* Register товч */}
      <TouchableOpacity onPress={handleRegister} style={styles.buttonContainer}>
        <LinearGradient
          colors={["#9b59b6", "#e056fd"]}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.buttonText}>Бүртгүүлэх</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Success message */}
      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text> // Display success message
      ) : null}

      {/* Login холбоос */}
      <TouchableOpacity onPress={() => router.push("/(tabs)/LoginScreen")}>
        <Text style={styles.registerText}>Нэвтрэх</Text>
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
  successMessage: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});

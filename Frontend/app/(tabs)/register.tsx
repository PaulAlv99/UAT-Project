import * as React from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const REGISTER = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <Text style={styles.title}>REGISTER</Text>
        <View style={styles.divider} />

        <View style={styles.inputGroup}>
          <Text style={styles.inputText}></Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputText}></Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputText}></Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputText}></Text>
        </View>

        <View style={styles.cookiesContainer}>
          <Text style={styles.cookiesText}>ACCEPT COOKIES</Text>
          <View style={styles.toggle}>
            <View style={styles.knob} />
          </View>
        </View>

        <View style={styles.confirmButton}>
          <Text style={styles.confirmText}>CONFIRM</Text>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>LOGIN</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff5833",
  },
  scroll: {
    alignItems: "center",
    padding: 20,
  },
  bgFrame: {
    marginTop: -40,
    marginBottom: 10,
  },
  title: {
    fontSize: 48,
    color: "#fff",
    fontFamily: "OpenSans-ExtraBold",
    marginBottom: 8,
  },
  divider: {
    height: 6,
    width: 180,
    backgroundColor: "#ffcc00",
    marginBottom: 20,
  },
  inputGroup: {
    width: "90%",
    backgroundColor: "#ffe789",
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "#e5b700",
    padding: 12,
    marginVertical: 8,
    alignItems: "flex-start",
  },
  inputText: {
    fontSize: 16,
    color: "rgba(0,0,0,0.6)",
    marginTop: 8,
    fontFamily: "OpenSans-Bold",
  },
  dropdownIcon: {
    position: "absolute",
    right: 16,
    top: 30,
  },
  dropdownArrow: {
    position: "absolute",
    right: 26,
    top: 38,
  },
  cookiesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  cookiesText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "OpenSans-Bold",
    marginRight: 12,
  },
  toggle: {
    backgroundColor: "#ffcc00",
    width: 58,
    height: 35,
    borderRadius: 100,
    justifyContent: "center",
  },
  knob: {
    width: 27,
    height: 27,
    backgroundColor: "#fff",
    borderRadius: 100,
    alignSelf: "flex-end",
    marginRight: 4,
  },
  confirmButton: {
    backgroundColor: "#e5b800",
    borderColor: "#ad8b06",
    borderWidth: 5,
    borderRadius: 100,
    marginTop: 24,
    width: 240,
    padding: 12,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "OpenSans-Bold",
  },
  loginContainer: {
    marginTop: 16,
    backgroundColor: "#ad8b06",
    borderColor: "#6a5a1c",
    borderWidth: 4,
    borderRadius: 100,
    width: 180,
    padding: 10,
    alignItems: "center",
  },
  loginText: {
    color: "#6a5a1c",
    fontSize: 20,
    fontFamily: "OpenSans-ExtraBold",
  },
});

export default REGISTER;

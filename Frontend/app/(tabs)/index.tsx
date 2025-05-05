import * as React from "react";
import {Image, StyleSheet, View, Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const HomeScreen = () => {

  	return (
    		<SafeAreaView style={styles.primary}>
      			<Image style={styles.soLogo1} resizeMode="cover" source="so logo 1.png" />
      			<View style={[styles.primaryChild, styles.primaryShadowBox]} />
      			<Text style={[styles.whereYour, styles.recipesText]}>{`WHERE YOUR `}</Text>
      			<Text style={[styles.comeTogether, styles.recipesText]}>COME TOGETHER</Text>
      			<Text style={[styles.recipes, styles.recipesText]}>RECIPES</Text>
      			<View style={[styles.primaryItem, styles.primaryShadowBox]} />
      			<Text style={[styles.register, styles.loginFlexBox]}>REGISTER</Text>
      			<Text style={[styles.login, styles.loginFlexBox]}>LOGIN</Text>
    		</SafeAreaView>);
};

const styles = StyleSheet.create({
  	primaryShadowBox: {
    		borderColor: "#f8ac50",
    		borderStyle: "solid",
    		backgroundColor: "#ff8c00",
    		borderRadius: 100,
    		shadowOpacity: 1,
    		elevation: 4,
    		shadowRadius: 4,
    		shadowOffset: {
      			width: 0,
      			height: 4
    		},
    		shadowColor: "rgba(0, 0, 0, 0.25)",
    		position: "absolute"
  	},
  	recipesText: {
    		textShadowRadius: 4,
    		textShadowColor: "rgba(0, 0, 0, 0.25)",
    		justifyContent: "center",
    		alignItems: "center",
    		display: "flex",
    		textAlign: "center",
    		lineHeight: 60,
    		letterSpacing: 0,
    		position: "absolute"
  	},
  	loginFlexBox: {
    		lineHeight: 40,
    		justifyContent: "center",
    		alignItems: "center",
    		display: "flex",
    		textAlign: "center",
    		color: "#fff",
    		fontFamily: "OpenSans-ExtraBold",
    		fontWeight: "800",
    		letterSpacing: 0,
    		position: "absolute"
  	},
  	soLogo1: {
    		top: 10,
    		left: -295,
    		width: 931,
    		height: 853,
    		position: "absolute"
  	},
  	primaryChild: {
    		top: 607,
    		left: 105,
    		borderWidth: 5,
    		width: 202,
    		height: 58
  	},
  	whereYour: {
    		top: 119,
    		left: 18,
    		fontSize: 36,
    		width: 377,
    		height: 88,
    		textShadowOffset: {
      			width: 0,
      			height: 4
    		},
    		color: "#fff",
    		fontFamily: "OpenSans-ExtraBold",
    		fontWeight: "800",
    		textShadowRadius: 4,
    		textShadowColor: "rgba(0, 0, 0, 0.25)",
    		justifyContent: "center",
    		alignItems: "center",
    		display: "flex",
    		textAlign: "center",
    		lineHeight: 60,
    		letterSpacing: 0
  	},
  	comeTogether: {
    		top: 279,
    		left: 12,
    		fontSize: 40,
    		width: 388,
    		height: 120,
    		textShadowOffset: {
      			width: 0,
      			height: 4
    		},
    		color: "#fff",
    		fontFamily: "OpenSans-ExtraBold",
    		fontWeight: "800",
    		textShadowRadius: 4,
    		textShadowColor: "rgba(0, 0, 0, 0.25)",
    		justifyContent: "center",
    		alignItems: "center",
    		display: "flex",
    		textAlign: "center",
    		lineHeight: 60,
    		letterSpacing: 0
  	},
  	recipes: {
    		top: 163,
    		left: 5,
    		fontSize: 96,
    		fontWeight: "700",
    		fontFamily: "OleoScript-Bold",
    		color: "#ffe789",
    		width: 402,
    		height: 172,
    		textShadowRadius: 4,
    		textShadowColor: "rgba(0, 0, 0, 0.25)",
    		justifyContent: "center",
    		alignItems: "center",
    		display: "flex",
    		textAlign: "center",
    		lineHeight: 60,
    		letterSpacing: 0
  	},
  	primaryItem: {
    		top: 481,
    		left: 43,
    		borderWidth: 7,
    		width: 325,
    		height: 101
  	},
  	register: {
    		top: 613,
    		left: 111,
    		fontSize: 32,
    		width: 196,
    		height: 46
  	},
  	login: {
    		top: 499,
    		left: 96,
    		fontSize: 64,
    		width: 220,
    		height: 65
  	},
  	primary: {
    		backgroundColor: "#c70038",
    		flex: 1,
    		width: "100%",
    		height: 917,
    		overflow: "hidden"
  	}
});

export default HomeScreen;

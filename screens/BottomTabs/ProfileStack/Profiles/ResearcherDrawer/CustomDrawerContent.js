import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import Banner from "../../../../../components/Banner";
import { CustomLine } from "../../../../../components/Ui";
import PressableIconTextContainer from "../../../../../components/PressableIconTextContainer";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../../../../../store/context";
import { COLORS } from "../../../../../constants/colors";
const deviceHeight = Dimensions.get("window").height;

function ResearcherDrawerContent(props) {
  console.log("Props ", props.profile);
  const AppCtx = useContext(AppContext);

  console.log("This is what i received ", props.usergroup);
  return (
    <View style={styles.container}>
      <Banner usergroup={props.usergroup} profile={props.profile} />
      <ScrollView style={styles.parentOuterView} {...props}>
        <View style={styles.outerView}>
          <View>
            <LinearGradient
              style={styles.firstContainer}
              colors={[COLORS.primary, COLORS.secondary]}
            >
              <PressableIconTextContainer
                color="#fff"
                size={28}
                name="addfile"
                titleStyle={{ marginLeft: 8, color: "#fff" }}
                style={{ paddingVertical: 10 }}
                onPress={() => {}}
              >
                Add Article
              </PressableIconTextContainer>
              <CustomLine
                color={COLORS.thirdary}
                style={{ marginBottom: 1, marginHorizontal: 10 }}
              />

              <PressableIconTextContainer
                color="#fff"
                size={28}
                name="contacts"
                // onPress={() => navigation.navigate("ChangeProfileScreen")}
                titleStyle={{ marginLeft: 8, color: "#fff" }}
                style={{ paddingVertical: 10 }}
              >
                Edit Profile
              </PressableIconTextContainer>
              <CustomLine
                color={COLORS.thirdary}
                style={{ marginBottom: 1, marginHorizontal: 10 }}
              />

              <PressableIconTextContainer
                color="#fff"
                size={28}
                name="lock"
                // onPress={() => navigation.navigate("ChangePassword")}
                titleStyle={{ marginLeft: 8, color: "#fff" }}
                style={{ paddingVertical: 10 }}
              >
                Change Password
              </PressableIconTextContainer>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
      <CustomLine />
      <View style={{ alignItems: "center" }}>
        <PressableIconTextContainer
          color="#d9534f"
          size={28}
          name="logout"
          onPress={() => {
            AppCtx.logout();
          }}
          titleStyle={{ marginLeft: 8, color: "#d9534f" }}
          style={{ paddingVertical: 10 }}
        >
          Logout
        </PressableIconTextContainer>
      </View>
    </View>
  );
}

export default ResearcherDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lgContainer: {
    flex: 0.3,
  },
  firstContainer: {
    marginTop: 5,
  },
  secondContainer: {
    marginTop: 5,
  },
  drawerItemsContainer: {
    margin: 0,
    padding: 0,
  },

  parentOuterView: {
    flex: 1,
  },
  outerView: {
    flex: 1,
  },
  imgBack: {
    flex: 1,
  },
  title: {
    fontFamily: "montserrat-17",
    textAlign: "center",
    color: "white",
    fontSize: 25,
  },

  textHolder: {
    marginLeft: 10,
  },
  nameText: {
    fontFamily: "overpass-reg",
    fontSize: 25,
    color: "white",
  },
  sub: {
    fontFamily: "montserrat-17",
    fontSize: 15,
    color: "white",
  },
  wrapperView: {
    flex: 1,
    height: "100%",
    width: "100%",
    // marginBottom: deviceHeight < 700 ? 15 : 30,
  },
  innerWrapperView: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  bottomView: {
    flexDirection: "row",
    alignItems: "center",
  },
  conte: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imageProfile: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  authButtonContainer: {
    alignItems: "center",
  },
  increasedMarginTop: {
    marginTop: deviceHeight < 700 ? 15 : 20,
  },
  followContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
});

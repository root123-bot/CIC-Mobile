import { Foundation, MaterialIcons } from "@expo/vector-icons";
import React, { memo, useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { AppContext } from "../store/context";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { BASE_URL } from "../constants/domain";
import { TransparentPopUpIconMessage } from "./Messages";
// import { CustomizedLottieMessage, TransparentPopUpIconMessage } from "./Ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingSpinner } from "./Ui";
import { ResearcherArticles } from "../utils/requests";

function AdvancedPanel({
  title,
  subtitle,
  icon,
  color,
  showMessageHandler,
  showSwitchAccountMessage,
}) {
  const AppCtx = useContext(AppContext);
  const navigation = useNavigation();
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  const checkForPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;

    if (finalStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus;
  };

  async function executeUserMetadata() {
    let user_id = await AsyncStorage.getItem("user_id");
    return fetch(`${BASE_URL}/api/userdetails/`, {
      method: "POST",
      body: JSON.stringify({
        user_id: user_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          if (res.status === 404) {
            throw new Error(`Unrecognized user group ${user_id}`);
          }
          throw new Error("Internal server error");
        }
        return res.json();
      })
      .then((resData) => {
        return Promise.resolve(resData);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  //   useEffect(() => {
  //     async function configurePushNotificatons() {
  //       const finalStatus = await checkForPermission();

  //       if (finalStatus !== "granted") {
  //         return;
  //       }

  //       const pushToken = await Notifications.getExpoPushTokenAsync();
  //       console.log("PUSH TOKEN ", pushToken);
  //       // for android to work receive push notification we should specify channel
  //       if (Platform.OS === "android") {
  //         Notifications.setNotificationChannelAsync("default", {
  //           name: "default",
  //           importance: Notifications.AndroidImportance.HIGH,
  //         });
  //       }
  //       fetch(`${BASE_URL}/api/savedevicenotificationtoken/`, {
  //         method: "POST",
  //         body: JSON.stringify({
  //           user_id: AppCtx.usermetadata.get_user_id,
  //           token: pushToken.data,
  //         }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //     }

  //     configurePushNotificatons();
  //   });

  async function moreFeaturesHandler() {
    AppCtx.manipulateIsSettingInactive(true);
    console.log("im clicked");
    // when pressed first execute the usermetadata
    let usermetadata = {};
    try {
      setFormSubmitLoader(true);
      setShowAnimation(true);
      usermetadata = await executeUserMetadata();
      AppCtx.manipulateUserMetadata(usermetadata);
      setFormSubmitLoader(false);
      setShowAnimation(false);
      AppCtx.manipulateIsSettingInactive(false);
    } catch (err) {
      AppCtx.manipulateIsSettingInactive(false);
      // if we have error message of recognized usergroup then we should logout user and redirect him to login again...
      // also remember we should also delete that account since the user exist but his profile has been deleted, so i
      // think we should not delete that account and we only need to redirect the user... BUT REMEMBER ITS OUR FAULT TO
      // HAVE THE USER WHICH IS GROUP IS NOT RECOGNIZED OTHERWISE ITS THE SUPERUSER... OR OTHERWISE WE SHOULD TELL THE
      // USER YOUR ACCOUNT IS DELETED YOU SHOULD HAVE CREATE A NEW ONE BUT ITS BAD USER EXPERIENCE
      if (
        err.message.toLowerCase().includes("Unrecognized user".toLowerCase())
      ) {
        // delete that user... i don't care about the result...
        const splitted = err.message.split(" ");
        const user_id = splitted[splitted.length - 1];
        console.log(
          "THIS IS SPLITTED ARRAY ",
          splitted,
          splitted[splitted.length - 1]
        );
        fetch(`${BASE_URL}/api/delete_user/`, {
          method: "POST",
          body: JSON.stringify({
            user_id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => console.log("THIS IS RESOLVED RESPONSE ", data))
          .catch((err) => console.log("THIS IS ERROR MESSAGE ", err.message));

        // we logout the user then we should

        AppCtx.logout();
        // then i think we should delete that user because if you deleted his profile what you expect, you expect him to have
        // the "unrecognized" group
        // show descriptive alert that the account has been deleted so he should create a new one..
        alert("Your account have been deleted, register again");
        setFormSubmitLoader(false);
        setShowAnimation(false);
      } else {
        // console.log('THIS IS ERROR WE HAVING HERE ', err.message)
        // before ilikuwa "alert(`${err.message}`".. mostly case ya hapa ni kwamba user does not exist
        alert(`User session expired login again.`);
        // i think we should logout the user, IN CASE THE USER IS DELETED INSTEAD OF KIBANDA THEN USER WILL NOT
        // EXISTS SO WE SHOULD HAVE ANOTHER ERROR..... i think in this case lets logout the user..
        setFormSubmitLoader(false);
        setShowAnimation(false);
        AppCtx.logout();
      }
    }
    // here we should deal with 4 kind of redirect...
    // 1. if the user is "researcher" and "not completed" profile
    // 2. if the user  is "researcher" and "profile is completed" but "not active"
    // 3. if the user is "researcher" and "profile is completed" and "active"
    // 4. if the user is "officer" and "not completed" profile
    // 5. if the user is "officer" and "profile is completed" but "not active"
    // 6. if the user is "officer" and "profile is completed" and "active"

    // 1. if the user is of category of "customer"
    if (
      usermetadata.usergroup.toLowerCase() === "researcher" &&
      !usermetadata.profile_is_completed
    ) {
      console.log("Im in this section");
      AppCtx.manipulateIsSettingInactive(false);
      // redirect to the complete profile screen
      navigation.navigate("CompleteResearcherProfile");
    }

    // 2
    if (
      usermetadata.usergroup.toLowerCase() === "researcher" &&
      usermetadata.profile_is_completed &&
      !usermetadata.is_active
    ) {
      AppCtx.manipulateIsSettingInactive(false);
      navigation.navigate("WaitingVerification");
    }

    // 3
    if (
      usermetadata.usergroup.toLowerCase() === "researcher" &&
      usermetadata.profile_is_completed &&
      usermetadata.is_active
    ) {
      console.log("im the condition 3");
      // i think we should fetch the artical if he should be redirected to the researcher.
      // lets fetch some content
      try {
        const response = await ResearcherArticles(
          AppCtx.usermetadata.get_user_id
        );
        AppCtx.updateUserRawPost(response);
        AppCtx.manipulateIsSettingInactive(false);
        navigation.navigate("ResearcherProfile");
      } catch (err) {
        console.log("THIS IS ERROR MESSAGE ", err.message);
        setFormSubmitLoader(false);
        setShowAnimation(false);
        alert(err.message);
      }
    }

    // 4
    if (
      usermetadata.usergroup.toLowerCase() === "officer" &&
      !usermetadata.profile_is_completed
    ) {
      AppCtx.manipulateIsSettingInactive(false);
      navigation.navigate("CompleteOfficerProfile");
    }

    // 5
    if (
      usermetadata.usergroup.toLowerCase() === "officer" &&
      usermetadata.profile_is_completed &&
      !usermetadata.is_active
    ) {
      AppCtx.manipulateIsSettingInactive(false);
      navigation.navigate("WaitingVerification");
    }

    // 6
    if (
      usermetadata.usergroup.toLowerCase() === "officer" &&
      usermetadata.profile_is_completed &&
      usermetadata.is_active
    ) {
      AppCtx.manipulateIsSettingInactive(false);
      navigation.navigate("OfficerProfile");
    }

    AppCtx.manipulateIsSettingInactive(false);
  }

  if (AppCtx.stillExecutingUserMetadata) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <View
        style={{
          display: formSubmitLoader ? "flex" : "none",
          position: "absolute",
          top: "40%",
          zIndex: 10000000000,
          alignSelf: "center",
          width: 150,
          height: 150,
          justifyContent: "center",
        }}
      >
        <TransparentPopUpIconMessage
          messageHeader={"Imemaliza"}
          icon={"check"}
          inProcess={showAnimation}
        />
      </View>

      {AppCtx.usermetadata.usergroup.toLowerCase() !== "mkulima" && (
        <View
          style={[styles.container, { zIndex: -1 }]}
          pointerEvents={formSubmitLoader ? "none" : "auto"}
        >
          <View>
            <TouchableOpacity onPress={moreFeaturesHandler}>
              <View style={styles.itemContainer}>
                <View style={styles.iconHolder}>
                  <Foundation name="indent-more" size={30} color="green" />
                </View>
                <View>
                  <Text style={styles.title}>More Features</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

export default memo(AdvancedPanel);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "black",
    marginBottom: 10,
    opacity: 0.7,
  },
  itemContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  iconHolder: {
    marginRight: 20,
    marginLeft: 10,
  },
  customLine: {
    marginHorizontal: 10,
  },
  title: {
    fontFamily: "montserrat-17",
    color: "white",
  },
  title1: {
    fontFamily: "overpass-reg",
    fontSize: 12,
    color: "white",
  },
});

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { memo, useContext, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { COLORS } from "../constants/colors";
import { CustomLine } from "./Ui";
import { TransparentPopUpIconMessage } from "./Messages";
import { BASE_URL } from "../constants/domain";
import { AppContext } from "../store/context";

function TransparentBackgroundButton({ title, subtitle, icon, color }) {
  const AppCtx = useContext(AppContext);
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [ikoni, setIcon] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  function logoutHandler() {
    AppCtx.logout();
  }

  function deleteAccountHandler() {
    setFormSubmitLoader(true);
    setShowAnimation(true);
    AppCtx.manipulateIsSettingInactive(true);

    // user need to delete account
    fetch(`${BASE_URL}/api/delete_user/`, {
      method: "POST",
      body: JSON.stringify({
        user_id: AppCtx.usermetadata.get_user_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // after deleting user lets logout that user
        AppCtx.logout();
        setShowAnimation(false);
        setMessage("Okay");
        setIcon("check");
        setTimeout(() => {
          setFormSubmitLoader(false);
          AppCtx.manipulateIsSettingInactive(false);
        });
      })
      .catch((err) => {
        console.log("Failed  to delete user ", err.message);
        setShowAnimation(false);
        setMessage("Failed");
        setIcon("close");
        setTimeout(() => {
          setFormSubmitLoader(false);
          AppCtx.manipulateIsSettingInactive(false);
        }, 1000);
      });
  }

  return (
    <View style={[styles.container, { position: "relative" }]}>
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
          messageHeader={message}
          icon={ikoni}
          inProcess={showAnimation}
        />
      </View>
      <View
        style={[styles.container, { zIndex: -1 }]}
        pointerEvents={formSubmitLoader ? "none" : "auto"}
      >
        <TouchableOpacity
          onPress={() => {
            // AppCtx.manipulateTargettedChangePassword("customer");
            // navigation.navigate("ChangePassword");
          }}
        >
          <View style={styles.itemContainer}>
            <View style={styles.iconHolder}>
              <Ionicons name="lock-closed" size={30} color="grey" />
            </View>
            <View>
              <Text style={styles.title}>Change Password</Text>
            </View>
          </View>
        </TouchableOpacity>
        <CustomLine color={"grey"} style={styles.customLine} />
        <TouchableOpacity onPress={logoutHandler}>
          <View style={styles.itemContainer}>
            <View style={styles.iconHolder}>
              <MaterialIcons name="logout" size={30} color="grey" />
            </View>
            <View>
              <Text style={styles.title}>Logout</Text>
            </View>
          </View>
        </TouchableOpacity>
        <CustomLine color={"grey"} style={styles.customLine} />
        {Platform.OS === "ios" && (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Are you sure?",
                "Are you sure you want to delete account, the process is irreversible.",
                [
                  {
                    text: "Cancel",
                    onPress: () => {
                      console.log("Hello world");
                    },
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                      // deleteAccountHandler();
                    },
                  },
                ]
              );
            }}
          >
            <View style={styles.itemContainer}>
              <View style={styles.iconHolder}>
                <MaterialIcons name="delete" size={30} color={"red"} />
              </View>
              <View>
                <Text style={[styles.title, { color: "red" }]}>
                  Delete Account
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default memo(TransparentBackgroundButton);

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: "black",
    marginBottom: 10,
    opacity: 0.8,
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
    marginBottom: 0,
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

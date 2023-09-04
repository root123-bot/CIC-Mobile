import React, { memo, useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Button, HelperText } from "react-native-paper";
import * as Device from "expo-device";
import { COLORS } from "../../../../constants/colors";
import { BASE_URL } from "../../../../constants/domain";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransparentPopUpIconMessage } from "../../../../components/Messages";
import { AppContext } from "../../../../store/context";
import { registerUser, executeUserMetadata } from "../../../../utils/requests";
import { computeUserGroup } from "../../../../utils";
import { Background } from "../../../../components/Ui";

function SetLoginPin({ navigation, route }) {
  const AppCtx = useContext(AppContext);
  const { reset } = route.params ? route.params : { reset: false };

  const [PIN, setPIN] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  const savePinHandler = async () => {
    Keyboard.dismiss();
    if (PIN.length !== 4) {
      return;
    }
    setFormSubmitLoader(true);
    setShowAnimation(true);

    if (reset) {
      const { user_id } = AppCtx.resetPhoneNumber;
      await AsyncStorage.setItem("user_id", user_id.toString());
      try {
        const metadata = await executeUserMetadata(user_id);
        AppCtx.manipulateUserMetadata(metadata);
      } catch (err) {
        if (
          err.message.toLowerCase().includes("Unrecognized user".toLowerCase())
        ) {
          const splitted = err.message.split(" ");
          const user_id = splitted[splitted.length - 1];
          fetch(`${BASE_URL}/api/delete_user/`, {
            method: "POST",
            body: JSON.stringify({
              user_id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          AppCtx.logout();
          alert("Your account have been deleted, register again.");
        } else {
          alert(err.message);
        }
        return;
      }

      try {
        const notifications = await userNotifications(user_id);
        AppCtx.updateusernotifications(notifications);
      } catch (error) {
        alert("Failed to connect to server, check your connection");
        return;
      }

      try {
        const orders = await fetchCustomerOrders(user_id);
        AppCtx.updateCustomerOrdersMetadata(orders);
      } catch (error) {
        alert("Failed to connect to server, check your connection");
        return;
      }

      const { user_group } = AppCtx.resetPhoneNumber;
      if (user_group.toLowerCase() === "kibanda") {
        try {
          const orders = await fetchKibandaOrders(user_id);
          AppCtx.updateKibandaOrdersMetadata(orders);
        } catch (error) {
          alert("Failed to connect to server, check your connection");
          return;
        }
      }

      setShowAnimation(false);
      setFormSubmitLoader(false);
      AppCtx.manipulateIsAunthenticated(true);

      navigation.navigate("Setting");
      return;
    }
    const uniqueDeviceId = Device.osBuildId;
    const phone_number = AppCtx.registermetadata.phone_number;
    console.log("this is register metadata ", AppCtx.registermetadata);
    const usergroup = computeUserGroup(AppCtx.registermetadata.usergroup);

    registerUser(phone_number, usergroup, PIN, uniqueDeviceId)
      .then((result) => {
        if (result.data.usergroup.toLowerCase() === "mkulima") {
          setMessage("Success");
          setIcon("check");

          setTimeout(() => {
            setFormSubmitLoader(false);
            AppCtx.manipulateUserMetadata(result.data);
            AsyncStorage.setItem("user_id", result.data.get_user_id.toString());
            const phone = result.data.phone_number.toString();

            AsyncStorage.setItem("phone_number", phone);
            AppCtx.manipulateIsAunthenticated(true);

            // hapa tunaweza tukaweka logic ya ku-if there is action require user to be authenticated so as to redirect him back there
            // if (AppCtx.afterLoginNext === "PlaceOrder") {
            //   return navigation.navigate("Home", {
            //     screen: "ConfirmOrder",
            //   });
            // }
            // We should go to "Profile" screen of mkulima
            // navigation.navigate("MkulimaProfile");
            navigation.navigate("ProfileScreen");
          }, 1000);
          setShowAnimation(false);
        } else if (result.data.usergroup.toLowerCase() === "researcher") {
          setMessage("Completed");
          setIcon("check");
          setTimeout(() => {
            AppCtx.manipulateUserMetadata(result.data);
            AsyncStorage.setItem("user_id", result.data.get_user_id.toString());
            const phone = result.data.phone_number.toString();
            AsyncStorage.setItem("phone_number", phone);
            AppCtx.manipulateIsAunthenticated(true);
            setFormSubmitLoader(false);
            // navigation.navigate("CompleteResearcherProfile");
            navigation.navigate("CompleteResearcherProfile");
          }, 1000);
          setShowAnimation(false);
        } else if (result.data.usergroup.toLowerCase() === "officer") {
          setMessage("Completed");
          setIcon("check");
          setTimeout(() => {
            AppCtx.manipulateUserMetadata(result.data);
            AsyncStorage.setItem("user_id", result.data.get_user_id.toString());
            const phone = result.data.phone_number.toString();
            AsyncStorage.setItem("phone_number", phone);
            AppCtx.manipulateIsAunthenticated(true);
            setFormSubmitLoader(false);
            // navigation.navigate("CompleteOfficerProfile");
            navigation.navigate("CompleteOfficerProfile");
          }, 1000);
          setShowAnimation(false);
        } else {
          // hii ni ngumu kutokea
        }
      })
      .catch((err) => {
        if (err.error.message === "Namba ishasajiliwa") {
          setMessage("Namba Ishatumika");
        } else {
          setMessage("Imefeli");
        }
        setIcon("close");
        setTimeout(() => {
          setFormSubmitLoader(false);
        }, 1000);
        setShowAnimation(false);
      });
  };

  return (
    <Background>
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <View
          style={styles.container}
          pointerEvents={formSubmitLoader ? "none" : "auto"}
        >
          <View
            style={{
              flex: 1,
              display: formSubmitLoader ? "flex" : "none",
              height: 150,
              width: 150,
              alignSelf: "center",
              position: "absolute",
              top: "40%",
              zIndex: 10,
            }}
          >
            <TransparentPopUpIconMessage
              messageHeader={message}
              icon={icon}
              inProcess={showAnimation}
            />
          </View>

          <View style={styles.innerContainer}>
            <Text style={styles.header}>Set Login PIN</Text>
            <HelperText style={styles.subheader}>
              You will use this pin to login to your account.
            </HelperText>

            <OTPInputView
              onCodeChanged={(msimbo) => setPIN(msimbo)}
              selectionColor={COLORS.primary}
              style={{
                width: "80%",
                height: 100,
                color: "grey",
              }}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              autoFocusOnLoad={false}
              pinCount={4}
            />
            <Button
              mode="contained"
              loading={formSubmitLoader}
              labelStyle={{
                fontFamily: "montserrat-17",
              }}
              style={{
                backgroundColor: COLORS.primary,
              }}
              onPress={savePinHandler}
            >
              Continue
            </Button>
          </View>
        </View>
      </View>
    </Background>
  );
}

export default memo(SetLoginPin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "96%",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "100%",
    padding: 15,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  header: {
    fontSize: 20,
    fontFamily: "montserrat-17",
    color: COLORS.primary,
  },
  subheader: {
    fontFamily: "overpass-reg",
    textAlign: "center",
  },
  underlineStyleBase: {
    width: 50,
    height: 55,
    borderColor: COLORS.primary,
    color: COLORS.primary,
    borderWidth: 2,
  },

  underlineStyleHighLighted: {
    borderColor: COLORS.primary,
  },
});

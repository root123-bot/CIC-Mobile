import React, { memo, useState, useContext } from "react";
import { View, Text, StyleSheet, Keyboard, Platform } from "react-native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { COLORS } from "../../../../constants/colors";
import { Button, HelperText } from "react-native-paper";
import { validateOTP } from "../../../../utils/requests";
import { AppContext } from "../../../../store/context";
import { TransparentPopUpIconMessage } from "../../../../components/Messages";
import { Background } from "../../../../components/Ui";

// keyboard loses focus only in emulator but not i real device https://github.com/tttstudios/react-native-otp-input/issues/174
// so issue ya keyboard ku-totokea na ku-lose focus inatokea kwenye iOS emulator`

function EnterOTPScreen({ navigation, route }) {
  const AppCtx = useContext(AppContext);
  const { reset } = route.params ? route.params : { reset: false };
  const [code, setCode] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  const verifyOTPHandler = () => {
    Keyboard.dismiss();
    if (code.length !== 4) {
      return;
    }

    setFormSubmitLoader(true);
    setShowAnimation(true);
    let phone = reset
      ? AppCtx.resetPhoneNumber.phone_number
      : AppCtx.registermetadata.phone_number;
    validateOTP(phone, code)
      .then((result) => {
        if (result.data) {
          if (result.data.message === "OTP validated successfully") {
            setMessage("Okay");
            setIcon("check");
            setTimeout(() => {
              AppCtx.manipulateAlreadyValidated(true);
              setFormSubmitLoader(false);
              reset
                ? navigation.navigate("SetPinScreen", {
                    reset: true,
                  })
                : navigation.navigate("SetPinScreen");
            }, 1000);
            setShowAnimation(false);
          } else {
            setMessage("OTP is not valid");
            setIcon("close");
            setTimeout(() => {
              setFormSubmitLoader(false);
            }, 1000);
            setShowAnimation(false);
          }
        }
      })
      .catch((error) => {
        console.log("Error ", error);
        alert("Server error in validating OTP");
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
            <Text style={styles.head}>Confirm your OTP Code</Text>
            <HelperText style={styles.subheader}>
              Please check your OTP on mobile.
            </HelperText>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <OTPInputView
                onCodeChanged={(msimbo) => setCode(msimbo)}
                selectionColor={COLORS.primary}
                // autoFocusOnLoad={Platform.OS === "ios" ? true : false}
                autoFocusOnLoad={false}
                style={{
                  width: "80%",
                  height: 100,
                  color: "grey",
                }}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                pinCount={4}
              />
            </View>
            <Button
              mode="contained"
              loading={formSubmitLoader}
              labelStyle={{
                fontFamily: "montserrat-17",
              }}
              style={{
                backgroundColor: COLORS.primary,
              }}
              onPress={verifyOTPHandler}
            >
              Continue
            </Button>
          </View>
        </View>
      </View>
    </Background>
  );
}

export default memo(EnterOTPScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 20,
  },
  head: {
    fontSize: 20,
    fontFamily: "montserrat-17",
    color: COLORS.primary,
    textAlign: "center",
  },
  subheader: {
    fontFamily: "overpass-reg",
    textAlign: "center",
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "black",
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

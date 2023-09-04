import React, { useContext, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  Keyboard,
} from "react-native";
import { AppContext } from "../../../../store/context";
import { TextInput, Button, HelperText } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../../../../constants/colors";
import { getOTP } from "../../../../utils/requests";
import PhoneInput from "react-native-phone-number-input";
import { Background } from "../../../../components/Ui";

function RegisterScreen({ route, navigation }) {
  const AppCtx = useContext(AppContext);
  const { ugroup } = route.params ? route.params : { ugroup: undefined };

  const phoneInput = useRef(null);

  const [userGroupIcons, setUserGroupIcons] = useState("chevron-down");
  const [toggleUserGroup, setToggleUserGroup] = useState("none");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedValue, setFormattedValue] = useState("+255");
  const [usergroup, setUserGroup] = useState("NORMAL USER");
  const [phone, setPhone] = useState({
    value: "",
    isValid: true,
  });

  async function jisajiliHandler() {
    Keyboard.dismiss();
    // length of phone input should be 9 and it should not start with 0
    const phoneValid = phone.value.length === 9 && !phone.value.startsWith("0");

    // full text phone number, should have the total length of 13
    const formattedValueValid = formattedValue.length === 13;

    if (!phoneValid || !formattedValueValid) {
      alert("Incorrect phone number");
      return;
    }

    if (loading) {
      return;
    }

    // everthing is good
    setFormSubmitLoader(true);
    setShowAnimation(true);
    setLoading(true);
    const phone_number = `${formattedValue}`;

    const group = usergroup;

    getOTP(phone_number)
      .then((result) => {
        if (result.data) {
          const metadata = {
            phone_number,
            usergroup: group,
            otp: result.data.OTP,
          };

          AppCtx.addRegisterMetadata(metadata);
          setLoading(false);
          setTimeout(() => {
            setFormSubmitLoader(false);
            navigation.navigate("VerifyOTPScreen");
          }, 1000);
          setShowAnimation(false);
        }
      })
      .catch((error) => {
        console.log("THIS IS ERROR ", error);
        setFormSubmitLoader(false);
        setShowAnimation(false);
        setLoading(false);
        alert(error.error.message);
      });
  }

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>
            {ugroup ? "WEKA TAARIFA" : "CREATE ACCOUNT"}
          </Text>
          {!ugroup && (
            <View style={styles.formInput}>
              {Platform.OS === "ios" ? (
                <>
                  <Pressable
                    onPress={() => {
                      if (toggleUserGroup === "none") {
                        setToggleUserGroup("flex");
                        setUserGroupIcons("chevron-up");
                        Keyboard.dismiss();
                      } else {
                        setToggleUserGroup("none");
                        setUserGroupIcons("chevron-down");
                      }
                    }}
                  >
                    <View pointerEvents="none">
                      <TextInput
                        label="Account Type"
                        editable={false}
                        value={usergroup}
                        style={[
                          styles.formInput,
                          { backgroundColor: COLORS.thirdary },
                        ]}
                        textColor={"black"}
                        underlineColor={COLORS.primary}
                        right={<TextInput.Icon icon={userGroupIcons} />}
                        activeOutlineColor={COLORS.primary}
                        outlineColor={COLORS.forthy}
                      />
                    </View>
                  </Pressable>
                  <Picker
                    mode="dropdown"
                    selectedValue={usergroup}
                    onValueChange={(text) => setUserGroup(text)}
                    style={[styles.pickerStyling, { display: toggleUserGroup }]}
                  >
                    <Picker.Item label="NORMAL USER" value="NORMAL USER" />
                    <Picker.Item label="RESEARCHER" value="RESEARCHER" />
                    <Picker.Item label="OFFICER" value="OFFICER" />
                  </Picker>
                </>
              ) : (
                <>
                  <View style={{ marginTop: "2%" }}>
                    <Text style={{ marginLeft: "3%" }}>
                      Chagua Aina ya Akaunti
                    </Text>
                    <View
                      style={{
                        borderColor: "white",
                        borderRadius: 5,
                        borderWidth: 1,
                      }}
                    >
                      <Picker
                        mode="dropdown"
                        style={{
                          backgroundColor: "white",
                        }}
                        selectedValue={usergroup}
                        onValueChange={(text) => setUserGroup(text)}
                      >
                        <Picker.Item label="NORMAL USER" value="NORMAL USER" />
                        <Picker.Item label="RESEARCHER" value="RESEARCHER" />
                        <Picker.Item label="OFFICER" value="OFFICER" />
                      </Picker>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}
          <View style={styles.formInput}>
            <PhoneInput
              ref={phoneInput}
              defaultValue={phone.value}
              defaultCode="TZ"
              layout="first"
              onChangeText={(text) => {
                setPhone({ value: text, isValid: true });
              }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text);
              }}
              containerStyle={{
                width: "100%",
                backgroundColor: COLORS.thirdary,
              }}
              textContainerStyle={{
                backgroundColor: COLORS.thirdary,
              }}
              withDarkTheme={false}
              withShadow
              autoFocus={false}
            />
          </View>
          <HelperText
            style={{
              color: COLORS.primary,
            }}
          >
            By continuing you confirm that you are authorized to use this phone
            number & agree to receive an SMS text.
          </HelperText>
          <Button
            buttonColor={COLORS.primary}
            textColor={COLORS.thirdary}
            labelStyle={{
              fontFamily: "montserrat-17",
            }}
            loading={loading}
            mode="contained"
            onPress={jisajiliHandler}
          >
            {ugroup ? "Endelea" : "Next"}
          </Button>
        </View>
      </View>
    </Background>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "96%",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontFamily: "montserrat-17",
    color: COLORS.primary,
    fontSize: 20,
  },
  formInput: {
    marginVertical: "2%",
  },
});

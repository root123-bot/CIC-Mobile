import React, { memo, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Pressable,
  Platform,
} from "react-native";

import { TransparentPopUpIconMessage } from "../../../../components/Messages";
import { ScrollView } from "react-native-gesture-handler";
import { Button, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../../../../constants/colors";
import ImagePicker from "../../../../components/ImagePicker";
import { AppContext } from "../../../../store/context";
import {
  CompleteOfficerProfileHandler,
  CompleteResearcherProfileHandler,
} from "../../../../utils/requests";

function CompleteResearcherProfile({ navigation }) {
  const AppCtx = useContext(AppContext);

  const [fname, setFname] = useState({
    value: "",
    isValid: true,
  });

  const [address, setAddress] = useState({
    value: "",
    isValid: true,
  });

  const [gender, setGender] = useState({
    value: "MALE",
    isValid: true,
  });

  const [toggleGender, setToggleGender] = useState("none");
  const [genderIcon, setGenderIcon] = useState("chevron-down");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");
  const [pickedImage, setPickedImage] = useState({
    value: undefined,
    isValid: true,
  });

  function profileHandler(image) {
    setPickedImage((prevState) => {
      return { ...prevState, value: image, isValid: true };
    });
  }

  function saveProfileHandler() {
    Keyboard.dismiss();

    setFormSubmitLoader(true);
    setShowAnimation(true);

    const fnameValid = fname.value.trim().length > 0;
    const addressValid = address.value.trim().length > 0;
    const pickedImageValid = pickedImage.value !== undefined;

    if (!fnameValid || !addressValid || !pickedImageValid) {
      setFname((prevState) => {
        return { ...prevState, isValid: fnameValid };
      });
      setAddress((prevState) => {
        return { ...prevState, isValid: addressValid };
      });
      setPickedImage((prevState) => {
        return { ...prevState, isValid: pickedImageValid };
      });
      setMessage("Fill all fields");
      setIcon("close");
      setTimeout(() => {
        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
        }, 500);
      }, 500);
      return;
    }

    // everything is good now
    const formUpload = new FormData();

    formUpload.append("user_id", AppCtx.usermetadata.get_user_id);
    formUpload.append("name", fname.value);
    formUpload.append("gender", gender.value);
    formUpload.append("address", address.value);

    let uri_splited = pickedImage.value.assets[0].uri.split(".");
    let file_type = uri_splited[uri_splited.length - 1];
    if (Platform.OS === "ios") {
      formUpload.append("profile", {
        uri: pickedImage.value.assets[0].uri,
        name: pickedImage.value.assets[0].fileName
          ? pickedImage.value.assets[0].fileName
          : "new_file." + file_type,
        type: pickedImage.value.assets[0].type,
      });
    } else if (Platform.OS === "android") {
      let uri = pickedImage.value.assets[0].uri;
      if (uri[0] === "/") {
        uri = `file://${pickedImage.value.assets[0].uri}`;
        uri = uri.replace(/%/g, "%25");
      }
      formUpload.append("profile", {
        uri: uri,
        name: "photo." + file_type,
        type: `image/${file_type}`,
      });
    }

    // post data to backend
    CompleteResearcherProfileHandler(formUpload, {
      "Content-Type": "multipart/form-data",
    })
      .then((result) => {
        AppCtx.manipulateUserMetadata(result);
        setIcon("check");
        setMessage("Profile Saved");
        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
          navigation.navigate("WaitingVerification");
        }, 1000);
      })
      .catch((err) => {
        setIcon("close");
        setMessage(err.message);
        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
        }, 1000);
      });
  }

  return (
    <View
      style={[
        styles.container,
        { position: "relative", marginBottom: 0, paddingBottom: 0 },
      ]}
    >
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
          icon={icon}
          inProcess={showAnimation}
        />
      </View>
      <View
        style={[
          {
            flex: 1,
          },
          styles.innerContainer,
          {
            marginTop: 0,
            paddingTop: 0,
          },
        ]}
        pointerEvents={formSubmitLoader ? "none" : "auto"}
      >
        <Text style={styles.mainHeader}>Setup Your Profile.</Text>
        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <ImagePicker
              fileHandler={profileHandler}
              isValid={pickedImage.isValid}
            />
            <TextInput
              //   mode="outlined"
              label="Full name"
              value={fname.value}
              onChangeText={(text) =>
                setFname((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              style={{
                backgroundColor: COLORS.thirdary,
              }}
              activeUnderlineColor={fname.isValid ? COLORS.primary : "#EF233C"}
              outlineColor={fname.isValid ? "grey" : "#EF233C"}
            />
            <TextInput
              //   mode="outlined"
              label="Physical Address"
              value={address.value}
              onChangeText={(text) =>
                setAddress((prevState) => {
                  return {
                    ...prevState,
                    value: text,
                    isValid: true,
                  };
                })
              }
              style={{
                backgroundColor: COLORS.thirdary,
                marginTop: "5%",
              }}
              activeUnderlineColor={
                address.isValid ? COLORS.primary : "#EF233C"
              }
              outlineColor={address.isValid ? "grey" : "#EF233C"}
            />
            {Platform.OS === "ios" ? (
              <>
                <Pressable
                  onPress={() => {
                    if (toggleGender === "none") {
                      setToggleGender("flex");
                      setGenderIcon("chevron-up");
                      Keyboard.dismiss();
                    } else {
                      setToggleGender("none");
                      setGenderIcon("chevron-down");
                    }
                  }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      label="Pick Gender"
                      editable={false}
                      value={gender.value}
                      style={[
                        styles.formInput,
                        { backgroundColor: COLORS.thirdary },
                      ]}
                      textColor={"black"}
                      underlineColor={COLORS.primary}
                      right={<TextInput.Icon icon={genderIcon} />}
                      activeOutlineColor={COLORS.primary}
                      outlineColor={COLORS.forthy}
                    />
                  </View>
                </Pressable>
                <Picker
                  mode="dropdown"
                  selectedValue={gender.value}
                  onValueChange={(text) => {
                    setGender((prevState) => {
                      return {
                        ...prevState,
                        value: text,
                        isValid: true,
                      };
                    });
                  }}
                  style={[styles.pickerStyling, { display: toggleGender }]}
                >
                  <Picker.Item label="MALE" value="MALE" />
                  <Picker.Item label="FEMALE" value="FEMALE" />
                </Picker>
              </>
            ) : (
              <>
                <View style={{ marginTop: "2%" }}>
                  <Text style={{ marginLeft: "3%" }}>Pick Gender</Text>
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
                      selectedValue={gender.value}
                      onValueChange={(text) => setGender(text)}
                    >
                      <Picker.Item label="MALE" value="MALE" />
                      <Picker.Item label="FEMALE" value="FEMALE" />
                    </Picker>
                  </View>
                </View>
              </>
            )}
          </View>
          <Button
            labelStyle={{
              fontFamily: "montserrat-17",
            }}
            style={{
              marginTop: 10,
              backgroundColor: COLORS.primary,
            }}
            mode="contained"
            onPress={saveProfileHandler}
          >
            Submit
          </Button>
          <View style={{ height: 100 }}></View>
        </ScrollView>
      </View>
    </View>
  );
}

export default memo(CompleteResearcherProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    width: "96%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
  },
  title: {
    fontFamily: "montserrat-17",
    color: COLORS.primary,
    fontSize: 20,
  },
  formInput: {
    marginVertical: "5%",
  },
  mainHeader: {
    fontSize: 30,
    fontFamily: "overpass-reg",
    marginTop: 25,
    textAlign: "center",
    color: COLORS.primary,
  },
});

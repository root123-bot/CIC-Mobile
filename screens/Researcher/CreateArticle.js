import React, { memo, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { CustomLine } from "../../components/Ui";
import * as DocumentPicker from "expo-document-picker";
import { launchImageLibraryAsync, PermissionStatus } from "expo-image-picker";
import { COLORS } from "../../constants/colors";
import { CreateArticleHandler } from "../../utils/requests";
import { AppContext } from "../../store/context";
import { TransparentPopUpIconMessage } from "../../components/Messages";
import { Picker } from "@react-native-picker/picker";
import * as ImageCache from "react-native-expo-image-cache";
import { MaterialIcons } from "@expo/vector-icons";

function CreateArticle({ navigation }) {
  const AppCtx = useContext(AppContext);

  const [mediaFiles, setMediaFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("KILIMO");
  const [content, setContent] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");
  const [toggleCategory, setToggleCategory] = useState("none");
  const [categoryIcons, setCategoryIcons] = useState("chevron-down");

  async function selectFile() {
    try {
      const response = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (response.type === "success") {
        console.log("this is response extract from document picker", response);
        console.log("file ", response);
        setMediaFiles((prevState) => [
          ...prevState,
          { payload: response, index: prevState.length },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loadImageHandler() {
    try {
      const captured = await launchImageLibraryAsync({
        quality: 0.2,
      });
      if (!captured.canceled) {
        const serialized_captured = {
          ...captured.assets[0],
          name:
            Platform.OS === "ios"
              ? captured.assets[0].fileName
              : captured.assets[0].uri.split("/")[
                  captured.assets[0].uri.split("/").length - 1
                ],
        };
        console.log("This is file original ", captured);
        console.log("Here is what captured ", serialized_captured);
        setMediaFiles((prevState) => [
          ...prevState,
          { payload: serialized_captured, index: prevState.length },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function importAudio() {
    const audio = await DocumentPicker.getDocumentAsync({
      type: "audio/mp3",
      copyToCacheDirectory: true,
    });
    audio.type !== "cancel" &&
      setMediaFiles((prevState) => [
        ...prevState,
        { payload: audio, index: prevState.length },
      ]);
  }

  //   pick only video
  async function importVideo() {
    const video = await DocumentPicker.getDocumentAsync({
      type: "video/mp4",
      copyToCacheDirectory: true,
    });
    video.type !== "cancel" &&
      setMediaFiles((prevState) => [
        ...prevState,
        { payload: video, index: prevState.length },
      ]);
  }

  function submitDataHandler() {
    if (title.trim().length === 0 || content.trim().length === 0) {
      return alert("We dont accept empy fields");
    }

    // otherwiser we're good to go..
    setShowAnimation(true);
    setFormSubmitLoader(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);
    formData.append("user_id", AppCtx.usermetadata.get_user_id);
    let counter = 0;
    mediaFiles.forEach((file) => {
      let uri_splited = file.payload.uri.split(".");
      let file_type = uri_splited[uri_splited.length - 1];
      let content = file.payload.uri;

      if (Platform.OS === "ios") {
        const fieldname = counter === 0 ? "media" : `media${counter}`;
        formData.append(fieldname, {
          uri: content,
          name: file.payload.name,
          type: file_type,
        });
      } else if (Platform.OS === "android") {
        const fieldname = counter === 0 ? "media" : `media${counter}`;
        let uri = file.payload.uri;
        if (uri[0] === "/") {
          uri = `file://${uri}`;
          uri = uri.replace(/%/g, "%25");
        }
        let filetype = file.payload.name.split(".");
        filetype = filetype[filetype.length - 1];
        formData.append(fieldname, {
          uri: uri,
          name: file.payload.name,
          type: `application/${filetype}`,
        });
      }
      counter++;
      // post multiple files https://stackoverflow.com/questions/12989442/uploading-multiple-files-using-formdata#:~:text=If%20you%20call%20data.,it%20does%20not%20already%20exist.
    });
    formData.append("total_media", `media${counter}`);
    CreateArticleHandler(formData, {
      "Content-Type": "multipart/form-data",
    })
      .then((result) => {
        console.log("result ", result);
        setIcon("check");
        AppCtx.manipulateUserRawPost(result);
        setMessage("Success");
        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
          navigation.navigate("ResearcherProfileScreen");
        }, 1000);
      })
      .catch((err) => {
        setIcon("close");
        setMessage("Failed");
        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
        }, 1000);
      });
  }

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
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
        style={styles.container}
        pointerEvents={formSubmitLoader ? "none" : "auto"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView
            behavior={Platform === "ios" ? "padding" : "height"}
          >
            <View>
              <View style={{ marginVertical: 10 }}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      width: "55%",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "montserrat-17",
                      }}
                      numberOfLines={1}
                    >
                      {`Embedded file (${mediaFiles.length})`}
                    </Text>
                    <HelperText
                      style={{
                        marginBottom: 0,
                        paddingBottom: 0,
                      }}
                      numberOfLines={1}
                      padding="none"
                    >
                      Tap respective icon
                    </HelperText>
                    <HelperText
                      style={{
                        marginTop: 0,
                        paddingTop: 0,
                      }}
                      numberOfLines={1}
                      padding="none"
                    >
                      ** Only .pdf, .mp3, .mp4, *images
                    </HelperText>
                  </View>
                  <View
                    style={{
                      width: "45%",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <TouchableOpacity
                      style={{ marginRight: 8 }}
                      onPress={selectFile}
                    >
                      <Image
                        source={require("../../assets/images/doc.png")}
                        style={{
                          width: 27,
                          height: 27,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ marginRight: 8 }}
                      onPress={loadImageHandler}
                    >
                      <Image
                        source={require("../../assets/images/photo.png")}
                        style={{
                          width: 27,
                          height: 27,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ marginRight: 8 }}
                      onPress={importAudio}
                    >
                      <Image
                        source={require("../../assets/images/music-file-2.png")}
                        style={{
                          width: 27,
                          height: 27,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ marginRight: 8 }}
                      onPress={importVideo}
                    >
                      <Image
                        source={require("../../assets/images/video-camera-2.png")}
                        style={{
                          width: 27,
                          height: 27,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <CustomLine color={"grey"} />
              </View>
              <TextInput
                onChangeText={(text) => setTitle(text)}
                label="Title"
                mode="outlined"
                value={title}
                style={styles.textInput}
                activeOutlineColor={COLORS.primary}
              />
              {Platform.OS === "ios" ? (
                <>
                  <Pressable
                    onPress={() => {
                      if (toggleCategory === "none") {
                        setToggleCategory("flex");
                        setCategoryIcons("chevron-up");
                        Keyboard.dismiss();
                      } else {
                        setToggleCategory("none");
                        setCategoryIcons("chevron-down");
                      }
                    }}
                  >
                    <View pointerEvents="none">
                      <TextInput
                        label="Category"
                        editable={false}
                        mode="outlined"
                        value={category}
                        style={[styles.textInput]}
                        textColor={"black"}
                        underlineColor={COLORS.primary}
                        right={<TextInput.Icon icon={categoryIcons} />}
                        activeOutlineColor={COLORS.primary}
                      />
                    </View>
                  </Pressable>
                  <Picker
                    mode="dropdown"
                    selectedValue={category}
                    onValueChange={(text) => setCategory(text)}
                    style={[styles.pickerStyling, { display: toggleCategory }]}
                  >
                    <Picker.Item label="KILIMO" value="KILIMO" />
                    <Picker.Item label="MAZINGIRA" value="MAZINGIRA" />
                  </Picker>
                </>
              ) : (
                <>
                  <View style={{ marginTop: "2%" }}>
                    <Text style={{ marginLeft: "3%" }}>Category</Text>
                    <View
                      style={{
                        borderColor: "grey",
                        borderRadius: 5,
                        borderWidth: 1,
                      }}
                    >
                      <Picker
                        mode="dropdown"
                        style={{
                          backgroundColor: "white",
                        }}
                        selectedValue={category}
                        onValueChange={(text) => setCategory(text)}
                      >
                        <Picker.Item label="KILIMO" value="KILIMO" />
                        <Picker.Item label="MAZINGIRA" value="MAZINGIRA" />
                      </Picker>
                    </View>
                  </View>
                </>
              )}
              {Platform.OS === "ios" ? (
                <TextInput
                  label="Content"
                  mode="outlined"
                  multiline={true}
                  onChangeText={(text) => setContent(text)}
                  style={[
                    styles.textInput,
                    {
                      paddingVertical: 15,
                      textAlignVertical: "top",
                    },
                  ]}
                  value={content}
                  activeOutlineColor={COLORS.primary}
                  numberOfLines={20}
                  // style={styles.textInput}
                />
              ) : (
                <TextInput
                  label="Content"
                  mode="outlined"
                  multiline={true}
                  onChangeText={(text) => setContent(text)}
                  style={[
                    styles.textInput,
                    {
                      paddingVertical: 15,
                      textAlignVertical: "top",
                    },
                  ]}
                  value={content}
                  activeOutlineColor={COLORS.primary}
                  numberOfLines={20}
                  // style={styles.textInput}
                />
              )}
              {/* box to display uploaded files */}
              {mediaFiles.length > 0 && (
                <View
                  style={{
                    width: "100%",
                    minHeight: 100,
                    borderColor: COLORS.primary,
                    borderWidth: 1,
                    padding: 15,
                    borderStyle: "dashed",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "montserrat-17",
                    }}
                  >
                    Attached files
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      marginVertical: 15,
                    }}
                  >
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      //   style={{
                      //     flexDirection: "row",
                      //     marginTop: 10,
                      //   }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        {mediaFiles
                          .filter((val) => {
                            console.log("This is our value ", val);
                            return (
                              val.payload.name.split(".")[
                                val.payload.name.split(".").length - 1
                              ] === "png" ||
                              val.payload.name.split(".")[
                                val.payload.name.split(".").length - 1
                              ] === "jpg" ||
                              val.payload.name.split(".")[
                                val.payload.name.split(".").length - 1
                              ] === "png" ||
                              val.payload.name.split(".")[
                                val.payload.name.split(".").length - 1
                              ] === "jpeg"
                            );
                          })
                          .map((media, index) => (
                            <View
                              style={{
                                width: 120,
                                height: 90,
                                margin: 10,
                              }}
                            >
                              <Image
                                source={{ uri: media.payload.uri }}
                                style={{
                                  width: "100%",
                                  borderRadius: 15,
                                  height: "100%",
                                }}
                              />

                              <View
                                style={{
                                  width: 30,
                                  height: 30,
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                }}
                              ></View>
                              <TouchableOpacity
                                style={{
                                  position: "absolute",
                                  top: 3,
                                  right: 3,
                                }}
                                onPress={() => {
                                  setMediaFiles((prevState) => {
                                    console.log(
                                      "index ",
                                      index,
                                      " length ",
                                      prevState.length
                                    );
                                    prevState.splice(media.index, 1);
                                    return [...prevState];
                                  });
                                  console.log("media files ", mediaFiles);
                                }}
                              >
                                <MaterialIcons
                                  name="delete"
                                  color={COLORS.danger}
                                  size={24}
                                />
                              </TouchableOpacity>
                            </View>
                          ))}
                      </View>
                    </ScrollView>
                  </View>
                  {/* other files */}
                  {mediaFiles
                    .filter((val) => {
                      return (
                        val.payload.name.split(".")[
                          val.payload.name.split(".").length - 1
                        ] !== "png" &&
                        val.payload.name.split(".")[
                          val.payload.name.split(".").length - 1
                        ] !== "jpg" &&
                        val.payload.name.split(".")[
                          val.payload.name.split(".").length - 1
                        ] !== "png" &&
                        val.payload.name.split(".")[
                          val.payload.name.split(".").length - 1
                        ] !== "jpeg"
                      );
                    })
                    .map((file, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginVertical: 5,
                        }}
                      >
                        <Image
                          source={
                            file.payload.name.split(".")[
                              file.payload.name.split(".").length - 1
                            ] === "pdf"
                              ? require("../../assets/images/doc.png")
                              : file.payload.name.split(".")[
                                  file.payload.name.split(".").length - 1
                                ] === "mp3"
                              ? require("../../assets/images/music-file-2.png")
                              : file.payload.name.split(".")[
                                  file.payload.name.split(".").length - 1
                                ] === "mp4"
                              ? require("../../assets/images/video-camera-2.png")
                              : require("../../assets/images/photo.png")
                          }
                          style={{ width: 16, height: 16 }}
                        />
                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize: 16,
                            fontFamily: "overpass-reg",
                          }}
                        >
                          {`${
                            file.payload.name.split(".")[0].substr(0, 10) +
                            "..."
                          } ${
                            file.payload.name.split(".")[
                              file.payload.name.split(".").length - 1
                            ]
                          }`}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setMediaFiles((prevState) => {
                              console.log(
                                "index ",
                                index,
                                " length ",
                                prevState.length
                              );
                              prevState.splice(file.index, 1);
                              return [...prevState];
                            });
                            console.log("media files ", mediaFiles);
                          }}
                        >
                          <Image
                            source={require("../../assets/icons/cancel.png")}
                            style={{ width: 16, height: 16, marginLeft: 7 }}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              )}
            </View>
            <Button
              onPress={submitDataHandler}
              mode="contained"
              style={{ marginTop: 20, backgroundColor: COLORS.primary }}
              labelStyle={{
                fontFamily: "montserrat-17",
              }}
            >
              Create Article
            </Button>
          </KeyboardAvoidingView>
          <View
            style={{
              height: 500,
            }}
          ></View>
        </ScrollView>
      </View>
    </View>
  );
}

export default memo(CreateArticle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginVertical: "3%",
  },
  textInput: {
    marginBottom: "3%",
  },
});

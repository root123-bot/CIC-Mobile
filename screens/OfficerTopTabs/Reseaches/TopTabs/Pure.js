import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
  memo,
} from "react";
import {
  View,
  Text,
  Keyboard,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
  Image,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HelperText, TextInput, Button } from "react-native-paper";
import { AppContext } from "../../../../store/context";
import { SearchBar } from "@rneui/themed";
import { Icon } from "@muratoner/semantic-ui-react-native";
import { COLORS } from "../../../../constants/colors";
import DataTable3 from "../../../../components/DataTable3";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import * as DocumentPicker from "expo-document-picker";
import { launchImageLibraryAsync, PermissionStatus } from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import * as ImageCache from "react-native-expo-image-cache";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TransparentPopUpIconMessage } from "../../../../components/Messages";
import { DraftArticle, UpdateArticle } from "../../../../utils/requests";
import { CustomLine, LoadingSpinner } from "../../../../components/Ui";
import { BASE_URL } from "../../../../constants/domain";
import { useNavigation } from "@react-navigation/native";

function PureResearches() {
  const navigation = useNavigation();
  const AppCtx = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [displayArticleDetails, setDisplayArticleDetails] = useState(false);
  const [data, setData] = useState(
    AppCtx.rArticles.filter((article) => !article.is_draft)
  );

  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => [1, "93%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    if (index < 1) {
      setDisplayArticleDetails(false);
    }
  }, []);

  // targetted Artcle data
  const [targettedArticle, setTargettedArticle] = useState();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");
  const [toggleCategory, setToggleCategory] = useState("none");
  const [categoryIcons, setCategoryIcons] = useState("chevron-down");
  const [trimmedServerMedia, setTrimmedServerMedia] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  // end of targetted Article data

  useEffect(() => {
    setData(AppCtx.rArticles.filter((article) => !article.is_draft));
  }, [AppCtx.rArticles.length, AppCtx.articleUpdated]);

  const searchHandler = (text) => {
    setSearch(text);

    const result = AppCtx.rArticles
      .filter((article) => !article.is_draft)
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(text.toLowerCase()) ||
          item.date_posted
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")
            .includes(text.toLowerCase())
        );
      });

    // set the data passed to the table
    setData(result);
  };

  const onTapArticleHandler = (article) => {
    setDisplayArticleDetails(true);
    setTargettedArticle(data.find((val) => +val.id === article));
    setTitle(data.find((val) => +val.id === article).title);
    setCategory(data.find((val) => +val.id === article).category);
    setContent(data.find((val) => +val.id === article).content);
    setMediaFiles(
      data
        .find((value) => +value.id === article)
        .posted_media.map((val, index) => ({
          payload: { uri: val.path, source: "server", id: val.id },
          index,
        }))
    );
    bottomSheetRef.current.snapToIndex(1);
  };

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

  function saveDraftHandler() {
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
    formData.append("post_id", targettedArticle.id);
    formData.append("trimmed_media", JSON.stringify(trimmedServerMedia));
    formData.append("user_id", AppCtx.usermetadata.get_user_id);

    let counter = 0;
    mediaFiles.forEach((file) => {
      if (file.payload.source === "server") {
        return;
      }
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
    DraftArticle(formData, {
      "Content-Type": "multipart/form-data",
    })
      .then((result) => {
        console.log("result ", result);
        setIcon("check");
        AppCtx.manipulateRArticles(result);
        AppCtx.incrementArticleUpdated();
        setMessage("Success");
        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
          bottomSheetRef.current.snapToIndex(0);
          // navigation.navigate("OfficerDashboard");
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
      }}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={[
          styles.tableHolder,
          displayArticleDetails ? { opacity: 0.3 } : { opacity: 1 },
        ]}
      >
        <View style={styles.headerHolder}>
          <Text style={styles.header}>{"ALL RESEARCHES"}</Text>
          <HelperText
            padding={false}
            style={{
              fontFamily: "overpass-reg",
              fontSize: 12,
              color: "white",
            }}
          >
            ** Need review to be published
          </HelperText>
        </View>
        {AppCtx.rArticles.filter((article) => !article.is_draft).length > 0 ? (
          <>
            <View style={{ marginTop: "2%" }}>
              <SearchBar
                platform={Platform.OS === "ios" ? "ios" : "default"}
                showCancel={false}
                round
                placeholder="Search..."
                light
                autoCorrect={false}
                placeholderTextColor={COLORS.primary}
                leftIcon={{ color: COLORS.primary }}
                inputContainerStyle={{
                  height: 20,
                  fontFamily: "montserrat-17",
                }}
                inputStyle={{
                  fontFamily: "montserrat-17",
                  fontSize: 14,
                  color: COLORS.primary,
                }}
                onChangeText={searchHandler}
                value={search}
                cancelButtonTitle=""
                containerStyle={{
                  backgroundColor: "transparent",
                  borderBottomColor: "transparent",
                  borderTopColor: "transparent",

                  marginHorizontal: "2%",
                }}
              />
            </View>
            <ScrollView style={styles.innerTableHolder}>
              <DataTable3 data={data} onTapHandler={onTapArticleHandler} />
            </ScrollView>
          </>
        ) : (
          <View
            style={{
              height: 100,
              marginHorizontal: "5%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "montserrat-17",
                fontSize: 16,
                color: "white",
                textAlign: "center",
              }}
            >
              No articles added yet
            </Text>
          </View>
        )}
      </LinearGradient>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose={true}
        snapPoints={snapPoints}
        style={{
          paddingHorizontal: "2%",
        }}
        onChange={handleSheetChanges}
      >
        {targettedArticle ? (
          <BottomSheetScrollView>
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
                  top: "55%",
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
                          <View>
                            <Text
                              style={{
                                color: "grey",
                                fontFamily: "montserrat-17",
                              }}
                            >
                              Rearcher Info
                            </Text>
                            <View
                              style={{
                                height: 50,
                                marginVertical: "2%",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{
                                  marginLeft: "0%",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: "overpass-reg",
                                    fontSize: 18,
                                  }}
                                >
                                  {targettedArticle &&
                                    targettedArticle.get_researcher.username}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: "montserrat-17",
                                    color: "grey",
                                  }}
                                >
                                  Phone:{" "}
                                  {targettedArticle &&
                                    targettedArticle.get_researcher.phone}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <TouchableOpacity>
                            <Text
                              style={{
                                fontFamily: "montserrat-17",
                                color: COLORS.danger,
                              }}
                            >
                              Delete
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <CustomLine color={"grey"} />

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
                              Embed file
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
                                source={require("../../../../assets/images/doc.png")}
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
                                source={require("../../../../assets/images/photo.png")}
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
                                source={require("../../../../assets/images/music-file-2.png")}
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
                                source={require("../../../../assets/images/video-camera-2.png")}
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
                        value={title}
                        mode="outlined"
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
                            style={[
                              styles.pickerStyling,
                              { display: toggleCategory },
                            ]}
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
                                <Picker.Item
                                  label="MAZINGIRA"
                                  value="MAZINGIRA"
                                />
                              </Picker>
                            </View>
                          </View>
                        </>
                      )}
                      <View
                        style={{
                          marginTop: "3%",
                        }}
                      >
                        <TouchableOpacity>
                          <Text
                            style={{
                              textAlign: "right",
                              fontFamily: "montserrat-17",
                              color: COLORS.primary,
                            }}
                          >
                            Translate to Swahili
                          </Text>
                        </TouchableOpacity>
                        <TextInput
                          label="Content"
                          mode="outlined"
                          multiline
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
                      </View>
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
                          {/* display uploaded images */}
                          <View
                            style={{
                              width: "100%",
                              marginVertical: 15,
                            }}
                          >
                            <ScrollView
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                {mediaFiles
                                  .filter((val) => {
                                    if (val.payload.source === "server") {
                                      return (
                                        val.payload.uri.split(".")[
                                          val.payload.uri.split(".").length - 1
                                        ] === "png" ||
                                        val.payload.uri.split(".")[
                                          val.payload.uri.split(".").length - 1
                                        ] === "jpg" ||
                                        val.payload.uri.split(".")[
                                          val.payload.uri.split(".").length - 1
                                        ] === "png" ||
                                        val.payload.uri.split(".")[
                                          val.payload.uri.split(".").length - 1
                                        ] === "jpeg"
                                      );
                                    } else {
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
                                    }
                                  })
                                  .map((media, index) => (
                                    <View
                                      key={index}
                                      style={{
                                        width: 120,
                                        height: 90,
                                        margin: 10,
                                      }}
                                    >
                                      {media.payload.source === "server" ? (
                                        <ImageCache.Image
                                          {...{
                                            preview: `${BASE_URL}${media.payload.uri}`,
                                            uri: `${BASE_URL}${media.payload.uri}`,
                                            tint: "dark",
                                            style: {
                                              width: "100%",
                                              borderRadius: 15,
                                              height: "100%",
                                            },
                                          }}
                                        />
                                      ) : (
                                        <Image
                                          source={{ uri: media.payload.uri }}
                                          style={{
                                            width: "100%",
                                            borderRadius: 15,
                                            height: "100%",
                                          }}
                                        />
                                      )}
                                      <>
                                        <View
                                          style={{
                                            width: 30,
                                            height: 30,
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            backgroundColor:
                                              "rgba(0, 0, 0, 0.5)",
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
                                            // also check if removed media is from the server, if so add it to the trimmed server media
                                            if (
                                              media.payload.source === "server"
                                            ) {
                                              setTrimmedServerMedia(
                                                (prevState) => [
                                                  ...prevState,
                                                  media.payload.id,
                                                ]
                                              );
                                            }
                                          }}
                                        >
                                          <MaterialIcons
                                            name="delete"
                                            color={COLORS.danger}
                                            size={24}
                                          />
                                        </TouchableOpacity>
                                      </>
                                    </View>
                                  ))}
                              </View>
                            </ScrollView>
                          </View>
                          {/* other files */}
                          {mediaFiles
                            .filter((val) => {
                              if (val.payload.source === "server") {
                                return (
                                  val.payload.uri.split(".")[
                                    val.payload.uri.split(".").length - 1
                                  ] !== "png" &&
                                  val.payload.uri.split(".")[
                                    val.payload.uri.split(".").length - 1
                                  ] !== "jpg" &&
                                  val.payload.uri.split(".")[
                                    val.payload.uri.split(".").length - 1
                                  ] !== "png" &&
                                  val.payload.uri.split(".")[
                                    val.payload.uri.split(".").length - 1
                                  ] !== "jpeg"
                                );
                              } else {
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
                              }
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
                                    file.payload.source === "server"
                                      ? file.payload.uri.split(".")[
                                          file.payload.uri.split(".").length - 1
                                        ] === "pdf"
                                        ? require("../../../../assets/images/doc.png")
                                        : file.payload.uri.split(".")[
                                            file.payload.uri.split(".").length -
                                              1
                                          ] === "mp3"
                                        ? require("../../../../assets/images/music-file-2.png")
                                        : file.payload.uri.split(".")[
                                            file.payload.uri.split(".").length -
                                              1
                                          ] === "mp4"
                                        ? require("../../../../assets/images/video-camera-2.png")
                                        : require("../../../../assets/images/photo.png")
                                      : file.payload.name.split(".")[
                                          file.payload.name.split(".").length -
                                            1
                                        ] === "pdf"
                                      ? require("../../../../assets/images/doc.png")
                                      : file.payload.name.split(".")[
                                          file.payload.name.split(".").length -
                                            1
                                        ] === "mp3"
                                      ? require("../../../../assets/images/music-file-2.png")
                                      : file.payload.name.split(".")[
                                          file.payload.name.split(".").length -
                                            1
                                        ] === "mp4"
                                      ? require("../../../../assets/images/video-camera-2.png")
                                      : require("../../../../assets/images/photo.png")
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
                                  {file.payload.source === "server"
                                    ? `${
                                        file.payload.uri
                                          .split("/")
                                          [
                                            file.payload.uri.split("/").length -
                                              1
                                          ].split(".")[0]
                                          .substr(0, 10) + "..."
                                      } ${
                                        file.payload.uri
                                          .split("/")
                                          [
                                            file.payload.uri.split("/").length -
                                              1
                                          ].split(".")[
                                          file.payload.uri
                                            .split("/")
                                            [
                                              file.payload.uri.split("/")
                                                .length - 1
                                            ].split(".").length - 1
                                        ]
                                      }`
                                    : `${
                                        file.payload.name
                                          .split(".")[0]
                                          .substr(0, 10) + "..."
                                      } ${
                                        file.payload.name.split(".")[
                                          file.payload.name.split(".").length -
                                            1
                                        ]
                                      }`}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    console.log("This is trimmed file ", file);
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
                                    // also check if removed media is from the server, if so add it to the trimmed server media
                                    if (file.payload.source === "server") {
                                      setTrimmedServerMedia((prevState) => [
                                        ...prevState,
                                        file.payload.id,
                                      ]);
                                    }
                                  }}
                                >
                                  <Image
                                    source={require("../../../../assets/icons/cancel.png")}
                                    style={{
                                      width: 16,
                                      height: 16,
                                      marginLeft: 7,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            ))}
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginVertical: 30,
                      }}
                    >
                      <Button
                        // onPress={submitDataHandler}
                        mode="contained"
                        style={{
                          width: "48%",
                          backgroundColor: COLORS.primary,
                        }}
                        labelStyle={{
                          fontFamily: "montserrat-17",
                        }}
                      >
                        Publish
                      </Button>
                      <Button
                        onPress={saveDraftHandler}
                        mode="contained"
                        style={{
                          width: "48%",
                          backgroundColor: COLORS.primary,
                        }}
                        labelStyle={{
                          fontFamily: "montserrat-17",
                        }}
                      >
                        Save Draft
                      </Button>
                    </View>
                  </KeyboardAvoidingView>
                  <View
                    style={{
                      height: 150,
                    }}
                  ></View>
                </ScrollView>
              </View>
            </View>
          </BottomSheetScrollView>
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoadingSpinner />
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

export default memo(PureResearches);

const styles = StyleSheet.create({
  cardHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "2%",
    marginTop: "5%",
    flex: 0.2,
  },
  tableHolder: {
    flex: 0.95,
    maxHeight: "100%",
    margin: "2%",
    marginTop: "5%",
    borderRadius: 15,
  },
  innerTableHolder: {
    margin: "4%",
    marginTop: "2%",
  },
  header: {
    fontFamily: "montserrat-17",
    fontSize: 20,
    color: "white",
    textTransform: "uppercase",
    marginLeft: "2%",
  },
  headerIcon: {
    fontFamily: "montserrat-17",
    fontSize: 20,
    color: "white",
    textTransform: "uppercase",
    marginLeft: "2%",
    color: "#55A630",
  },
  headerHolder: {
    marginHorizontal: "4%",
    marginTop: "4%",
  },
  addNew: {
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    marginBottom: "3%",
  },
});

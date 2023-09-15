import React, {
  memo,
  useState,
  useContext,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { CustomLine, Post } from "../../../components/Ui";
import { SliderBox } from "react-native-image-slider-box";
import { BASE_URL } from "../../../constants/domain";
import { COLORS } from "../../../constants/colors";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { AppContext } from "../../../store/context";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Button, TextInput } from "react-native-paper";
import { CommentPost, LikePost, UnlikePost } from "../../../utils/requests";

const width = Dimensions.get("window").width;

function PostDetails({ navigation, route }) {
  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => [1, "50%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    if (index < 1) {
      // setDisplayArticleDetails(false);
    }
  }, []);

  // ref
  const bottomSheetRef1 = useRef(null);

  // variables
  const snapPoints1 = useMemo(() => [1, "80%"], []);

  // callbacks
  const handleSheetChanges1 = useCallback((index) => {
    if (index < 1) {
      // setDisplayArticleDetails(false);
    }
  }, []);

  const metadata = route.params.post;
  const AppCtx = useContext(AppContext);
  const images = metadata.posted_media
    .filter(
      (value) =>
        value.path.includes(".jpg") ||
        value.path.includes(".png") ||
        value.path.includes(".jpeg")
    )
    .map((value) => `${BASE_URL}${value.path}`);

  const audios = metadata.posted_media
    .filter(
      (value) => value.path.includes(".mp3") || value.path.includes(".wav")
    )
    .map((value) => `${BASE_URL}${value.path}`);

  const videos = metadata.posted_media
    .filter(
      (value) =>
        value.path.includes(".mp4") ||
        value.path.includes(".avi") ||
        value.path.includes(".mov")
    )
    .map((value) => `${BASE_URL}${value.path}`);

  const pdfs = metadata.posted_media
    .filter((value) => value.path.includes(".pdf"))
    .map((value) => `${BASE_URL}${value.path}`);

  const [icon, setIcon] = useState(
    metadata.get_likes.likes.find(
      (item) => +item.sender_id === +AppCtx.usermetadata.get_user_id
    )
      ? "heart"
      : "hearto"
  );
  const [imageActive, setImageActive] = useState(0);
  const [articleLiked, setArticleLiked] = useState(0);
  const [sound, setSound] = useState();
  const [stillFetching, setStillFetching] = useState(false);
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(metadata.get_likes.total);
  const [loading, setLoading] = useState(false);
  const [activeArticle, setActiveArticle] = useState(metadata);

  useEffect(() => {
    console.log("I suspect changes");
    const activeArticle = AppCtx.rArticles.find(
      (rarticles) => rarticles.id === metadata.id
    );
    setActiveArticle(activeArticle);
  }, [AppCtx.rArticles.length, AppCtx.articleUpdated]);

  function submitCommentHandler() {
    console.log("Active article ", activeArticle);

    AppCtx.commentArticle(activeArticle, comment);
    setComment("");
    bottomSheetRef.current.snapToIndex(0);

    CommentPost(activeArticle.id, AppCtx.usermetadata.get_user_id, comment);
    AppCtx.incrementArticleUpdated();
  }

  const likePostHandler = async () => {
    if (!AppCtx.isAunthenticated) {
      Alert.alert(
        "Login is Required?",
        "To trigger this action you should register/login.",
        [
          {
            text: "Cancel",
          },
          {
            text: "Continue",
            style: "destructive",
            onPress: () => {
              navigation.navigate("ProfileStack", {
                screen: "LoginScreen",
                params: {
                  next: "Home",
                },
              });
            },
          },
        ]
      );
    } else {
      // by checking on "hearto" and "heart" we'll make sure the user does not like the same post twice
      // its important to call the likeRArticle function so as to update our context
      if (icon === "hearto") {
        console.log("I need to like post");
        AppCtx.likeRArticle(activeArticle);
        setLikes(likes + 1);
        setIcon("heart");

        LikePost(activeArticle.id, AppCtx.usermetadata.get_user_id);
        AppCtx.incrementArticleUpdated();
      } else {
        console.log("I need to unlike post");
        setLikes(likes > 0 ? likes - 1 : 0);
        AppCtx.unlikeRArticle(activeArticle);
        setIcon("hearto");

        // unlike act on server
        UnlikePost(activeArticle.id, AppCtx.usermetadata.get_user_id);
        AppCtx.incrementArticleUpdated();
      }
    }
  };

  function viewCommentHandler() {
    bottomSheetRef1.current.snapToIndex(1);
  }

  function writeCommentHandler() {
    bottomSheetRef.current.snapToIndex(1);
  }

  const commentPostHandler = async () => {
    if (!AppCtx.isAunthenticated) {
      Alert.alert(
        "Login is Required?",
        "To trigger this action you should register/login.",
        [
          {
            text: "Cancel",
          },
          {
            text: "Continue",
            style: "destructive",
            onPress: () => {
              navigation.navigate("ProfileStack", {
                screen: "LoginScreen",
                params: {
                  next: "Home",
                },
              });
            },
          },
        ]
      );
    } else {
      return writeCommentHandler();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <SliderBox
            dotColor={COLORS.primary}
            inactiveDotColor="grey"
            imageLoadingColor={COLORS.primary}
            images={images}
          />
        </View>
        <View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                color: "grey",
                fontFamily: "montserrat-17",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  marginVertical: 10,
                  fontFamily: "overpass-reg",
                  textAlign: "left",
                  textTransform: "capitalize",
                }}
              >
                {metadata.title}
              </Text>
              <Text
                style={{
                  fontFamily: "overpass-reg",
                  fontSize: 12,
                  color: "grey",
                }}
              >
                Cat: {metadata.category}
              </Text>
            </View>
            <Text>{metadata.content}</Text>
          </View>
          {audios.length > 0 ||
            videos.length > 0 ||
            (pdfs.length > 0 && (
              <View
                style={{
                  marginVertical: 10,
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: "grey",
                  padding: 15,
                }}
              >
                <Text
                  style={{
                    fontFamily: "overpass-reg",
                    fontSize: 12,
                  }}
                >
                  Other media files
                </Text>
              </View>
            ))}
          {/* like comment sections.. */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: Platform.OS === "ios" ? "flex-start" : "center",
              }}
              onPress={() =>
                console.log(
                  "Display who liked that post just a presentation screen to display them"
                )
              }
            >
              <AntDesign name="heart" size={16} color={COLORS.primary} />
              <Text
                style={{
                  fontFamily: "overpass-reg",
                  color: COLORS.primary,
                  fontSize: 16,
                  marginLeft: 5,
                }}
              >
                {likes}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={viewCommentHandler.bind(this, metadata)}>
              <Text
                style={{
                  fontFamily: "overpass-reg",
                  color: COLORS.primary,
                  fontSize: 16,
                }}
              >
                {`${activeArticle.get_comments.total} Comments`}
              </Text>
            </TouchableOpacity>
          </View>
          {/* do your like and comment */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 10,
            }}
          >
            {/* like post */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: Platform.OS === "ios" ? "flex-start" : "center",
              }}
              onPress={likePostHandler}
            >
              <AntDesign name={icon} size={20} color={COLORS.primary} />
              <Text
                style={{
                  fontFamily: "overpass-reg",
                  color: COLORS.forthy,
                  fontSize: 18,
                  marginLeft: 5,
                }}
              >
                Like
              </Text>
            </TouchableOpacity>

            {/* comment post */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: Platform.OS === "ios" ? "flex-start" : "center",
              }}
              onPress={commentPostHandler}
            >
              <FontAwesome name="comment-o" size={20} color={COLORS.forthy} />
              <Text
                style={{
                  fontFamily: "overpass-reg",
                  color: COLORS.forthy,
                  fontSize: 18,
                  marginLeft: 5,
                }}
              >
                Comment
              </Text>
            </TouchableOpacity>

            {/* share it */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: Platform.OS === "ios" ? "flex-start" : "center",
              }}
              onPress={() => console.log("Just share the post")}
            >
              <AntDesign name="sharealt" size={20} color={COLORS.forthy} />
              <Text
                style={{
                  fontFamily: "overpass-reg",
                  color: COLORS.forthy,
                  fontSize: 18,
                  marginLeft: 5,
                }}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <CustomLine color={COLORS.forthy} style={{ borderBottomWidth: 0.5 }} />
      </ScrollView>
      <BottomSheet
        // pointerEvents={formSubmitLoader ? "none" : "auto"}
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose={true}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: "#CED4DA",
        }}
        style={{
          paddingHorizontal: "2%",
        }}
        onChange={handleSheetChanges}
      >
        <View
          style={{
            padding: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              marginVertical: 10,
            }}
          >
            Write your comment
          </Text>
          <TextInput
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setComment(text)}
            label="Title"
            value={comment}
            mode="outlined"
            activeOutlineColor={"black"}
          />
          <Button
            mode="contained"
            labelStyle={{
              color: "white",
            }}
            onPress={submitCommentHandler}
            style={{ marginTop: 10, backgroundColor: "grey" }}
          >
            Submit
          </Button>
        </View>
      </BottomSheet>

      <BottomSheet
        // pointerEvents={formSubmitLoader ? "none" : "auto"}
        ref={bottomSheetRef1}
        index={-1}
        enablePanDownToClose={true}
        snapPoints={snapPoints1}
        backgroundStyle={{
          backgroundColor: "#CED4DA",
        }}
        style={{
          paddingHorizontal: "2%",
        }}
        onChange={handleSheetChanges}
      >
        <View
          style={{
            padding: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: "overpass-reg",
            }}
          >
            All Comments
          </Text>

          <View>
            {
              // check if the article has comments
              activeArticle &&
              AppCtx.rArticles.find((rarticles) => {
                return rarticles.id === activeArticle.id;
              }).get_comments.comments.length > 0 ? (
                activeArticle.get_comments.comments
                  .reverse()
                  .map((comment, index) => {
                    return (
                      <View key={index}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginVertical: 10,
                          }}
                        >
                          <Image
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 17.5,
                            }}
                            source={require("../../../assets/images/human.png")}
                          />
                          <View
                            style={{
                              marginLeft: 10,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "overpass-reg",
                                fontSize: 12,
                                color: "grey",
                                marginBottom: 2,
                              }}
                            >
                              {`#${Math.random().toString(36).substr(2, 5)}`}
                            </Text>
                            <Text
                              style={{
                                // backgroundColor: "red",
                                fontFamily: "montserrat-17",
                              }}
                            >
                              {comment.comment}
                            </Text>
                          </View>
                        </View>
                        <CustomLine />
                      </View>
                    );
                  })
              ) : (
                <View
                  style={{
                    marginVertical: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "montserrat-17",
                      color: COLORS.primary,
                      fontSize: 16,
                    }}
                  >
                    No comments posted
                  </Text>
                </View>
              )
            }
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

export default memo(PostDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "3%",
    paddingVertical: "3%",
  },
});

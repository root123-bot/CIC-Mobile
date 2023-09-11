import React, {
  memo,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import {
  AboutCard,
  CustomLine,
  LoadingSpinner,
  NavBar,
  Post,
} from "../../../components/Ui";
import { COLORS } from "../../../constants/colors";
import { Button, TextInput } from "react-native-paper";
import { AppContext } from "../../../store/context";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { CommentPost, ResearcherArticlesList } from "../../../utils/requests";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const width = Dimensions.get("window").width;

function HomeScreen() {
  const AppCtx = useContext(AppContext);

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

  const [stillFetching, setStillFetching] = useState(false);
  const [comment, setComment] = useState("");
  const [activeArticle, setActiveArticle] = useState(null);
  const fechResearcherList = async () => {
    try {
      setStillFetching(true);
      const rarticles = await ResearcherArticlesList();
      AppCtx.updateRArticles(rarticles);
      setStillFetching(false);
    } catch (error) {
      console.log("This is the error ", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    fechResearcherList();
  }, []);

  function viewCommentHandler(metadata) {
    setActiveArticle(metadata);
    console.log("Active comment ", activeArticle);
    bottomSheetRef1.current.snapToIndex(1);
  }

  function submitCommentHandler() {
    console.log("Active article ", activeArticle);

    AppCtx.commentArticle(activeArticle, comment);
    setComment("");
    bottomSheetRef.current.snapToIndex(0);

    // lets post the comment to the command
    CommentPost(activeArticle.id, AppCtx.usermetadata.get_user_id, comment);
  }

  if (stillFetching) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        paddingHorizontal: "3%",
        paddingVertical: "3%",
        backgroundColor: COLORS.thirdary,
      }}
    >
      {/* about card section */}
      {AppCtx.toggleOnAbout && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
          <AboutCard
            cancelHandler={() => AppCtx.manipulateToggleOnAbout(false)}
            colors={[COLORS.primary, COLORS.secondary]}
            title={"Welcome to Kilimo"}
            text={"Manage your farm in a simple, intuitive and complete way!"}
          />
        </Animated.View>
      )}

      {/* post sections, in future i should use the flatlist here to render post instead of scrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginVertical: 20,
        }}
      >
        {AppCtx.rArticles.filter((article) => article.get_is_published).length >
        0 ? (
          <>
            {AppCtx.rArticles
              .filter((article) => article.get_is_published)
              .map((article) => {
                console.log("tTHIS IS PASSED ARTICLE ", article);
                return (
                  <Post
                    key={article.id}
                    metadata={article}
                    author={article.get_researcher.username}
                    image={article.get_image}
                    viewCommentHandler={viewCommentHandler}
                    writeCommentHandler={(article) => {
                      console.log("someone called me");
                      console.log("Active article ", article);
                      bottomSheetRef.current.snapToIndex(1);
                      setActiveArticle(article);
                    }}
                  />
                );
              })}
          </>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>No content posted</Text>
          </View>
        )}
        {/* <Post
          author={"Mjukuu Othuman"}
          image={require("../../../assets/images/background/6.jpg")}
        /> */}
        {/* <Post
          author={"Erick Daniel"}
          image={require("../../../assets/images/background/5.jpg")}
        /> */}
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
            // style={styles.textInput}
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
              AppCtx.rArticles.find(
                (rarticles) => rarticles.id === activeArticle.id
              ).get_comments.comments.length > 0 ? (
                activeArticle.get_comments.comments
                  .reverse()
                  .map((comment, index) => {
                    console.log("This is the comment ", comment.comment);
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
    </SafeAreaView>
  );
}

export default memo(HomeScreen);

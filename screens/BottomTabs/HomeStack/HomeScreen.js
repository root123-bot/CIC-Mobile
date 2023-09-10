import React, { memo, useContext, useEffect, useState } from "react";
import { View, SafeAreaView, Text } from "react-native";
import {
  AboutCard,
  LoadingSpinner,
  NavBar,
  Post,
} from "../../../components/Ui";
import { COLORS } from "../../../constants/colors";
import { ScrollView } from "react-native-gesture-handler";
import { AppContext } from "../../../store/context";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { ResearcherArticlesList } from "../../../utils/requests";

function HomeScreen() {
  const AppCtx = useContext(AppContext);

  const [stillFetching, setStillFetching] = useState(false);

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
    </SafeAreaView>
  );
}

export default memo(HomeScreen);

import React, { memo, useContext } from "react";
import { View, SafeAreaView, Text } from "react-native";
import { AboutCard, NavBar, Post } from "../../../components/Ui";
import { COLORS } from "../../../constants/colors";
import { ScrollView } from "react-native-gesture-handler";
import { AppContext } from "../../../store/context";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

function HomeScreen() {
  const AppCtx = useContext(AppContext);

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
        <Post
          author={"Mjukuu Othuman"}
          image={require("../../../assets/images/background/6.jpg")}
        />
        <Post
          author={"Erick Daniel"}
          image={require("../../../assets/images/background/5.jpg")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default memo(HomeScreen);

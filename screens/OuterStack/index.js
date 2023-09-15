import React, { memo } from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { COLORS } from "../../constants/colors";

function IntroScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View>
          <Text
            style={{
              fontFamily: "montserrat-17",
              color: COLORS.primary,
              fontSize: 20,
            }}
          >
            Get Started
          </Text>
        </View>
      </SafeAreaView>
      <Text>I'm outer intro screen</Text>
    </View>
  );
}

export default memo(IntroScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

/* eslint-disable react-native/no-inline-styles */
import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { CustomizedLottieMessage } from "../../../components/Messages";
import { Background } from "../../../components/Ui";

function WaitingAdminVerification({ navigation }) {
  return (
    <Background>
      <View
        style={{
          flex: 1,
          height: 330,
          width: 330,
          alignSelf: "center",
          position: "absolute",
          top: "40%",
          zIndex: 100000000,
        }}
      >
        <CustomizedLottieMessage
          messageHeader="Waiting Verification"
          subHeader={"Your account is not yet verified by the admin"}
          lottieFile={require("../../../assets/LottieAnimations/69919-code-review.json")}
          lottiestyle={{
            marginBottom: 6,
            marginTop: 0,
            paddingTop: 0,
          }}
          buttonTitle="I understand"
          understandHandler={() => navigation.navigate("ProfileScreen")}
        />
      </View>
    </Background>
  );
}

export default memo(WaitingAdminVerification);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

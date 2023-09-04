import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";

function QuestionAnswers() {
  return (
    <View style={styles.container}>
      <Text>QuestionAnswers</Text>
    </View>
  );
}

export default memo(QuestionAnswers);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

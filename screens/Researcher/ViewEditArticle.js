import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

function ViewEditArticle() {
  return (
    <View style={styles.container}>
      <Text>ViewEditArticle</Text>
    </View>
  );
}

export default memo(ViewEditArticle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

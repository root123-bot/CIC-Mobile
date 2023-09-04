import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

function ResearcherProfile() {
  return (
    <View style={styles.container}>
      <Text>ResearcherProfile</Text>
    </View>
  );
}

export default memo(ResearcherProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";

function Researches() {
  return (
    <View style={styles.container}>
      <Text>Researches</Text>
    </View>
  );
}

export default memo(Researches);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

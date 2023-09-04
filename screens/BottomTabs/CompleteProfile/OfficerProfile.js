import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

function OfficerProfile() {
  return (
    <View style={styles.container}>
      <Text>OfficerProfile</Text>
    </View>
  );
}

export default memo(OfficerProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

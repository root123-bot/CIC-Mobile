import React, { memo } from "react"
import { View, Text, StyleSheet } from "react-native"

function MkulimaProfile() {
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Text>Hello im the mkulima profile</Text>
        </View>
    )
}

export default memo(MkulimaProfile)
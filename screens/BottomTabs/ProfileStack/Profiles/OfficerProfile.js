import React, { memo } from "react"
import { View, Text, StyleSheet } from "react-native"

function OfficerProfile() {
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Text>Hello im the officer profile</Text>
        </View>
    )
}

export default memo(OfficerProfile)
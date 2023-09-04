import React, { memo } from "react"
import { View , Text } from "react-native"

function PostScreen() {
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Text>hello im the post screen screen</Text>
        </View>
    )
}

export default memo(PostScreen)
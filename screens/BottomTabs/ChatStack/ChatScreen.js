import React, { memo } from "react"
import { View , Text } from "react-native"

function ChatScreen() {
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Text>hello im the chat screen</Text>
        </View>
    )
}

export default memo(ChatScreen)
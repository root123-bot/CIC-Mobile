import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import { Icon } from "react-native-elements";
import { COLORS } from "../constants/colors";
import AnimatedLottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

export const NavBar = () => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 25,
            color: COLORS.primary,
            fontFamily: "overpass-reg",
          }}
        >
          Home
        </Text>
        <TouchableOpacity>
          <Ionicons
            name="notifications-outline"
            size={30}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const LoadingSpinner = ({ color }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator color={color && color} />
    </View>
  );
};

export const Animation = ({
  source,
  style,
  onAnimationFinish,
  autoPlay = true,
  loop = true,
  speed = 1.5,
}) => {
  const lottieRef = useRef(null);
  useEffect(() => {
    lottieRef.current?.reset();
    setTimeout(() => {
      lottieRef.current?.play();
    }, 0);
  }, []);

  return (
    <AnimatedLottieView
      source={source}
      autoPlay={autoPlay}
      loop={loop}
      style={style}
      speed={speed}
      onAnimationFinish={onAnimationFinish}
      ref={lottieRef}
    />
  );
};

export const CustomLine = ({ color, style }) => {
  return (
    <View
      style={[
        {
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: color && color,
        },
        style,
      ]}
    ></View>
  );
};

export const Post = ({ metadata, style, image, author }) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/images/human.png")}
            style={{
              width: 38,
              height: 38,
              borderRadius: 17.5,
            }}
          />
          <View
            style={{
              marginLeft: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => console.log("Display profile info")}
            >
              <Text
                style={{
                  fontFamily: "overpass-reg",
                  fontSize: 16,
                }}
              >
                {author}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: "overpass-reg",
                fontSize: 12,
                color: COLORS.forthy,
              }}
            >
              19 Aug 23
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginRight: 3,
          }}
        >
          <FontAwesome5 name="ellipsis-v" size={22} color={COLORS.forthy} />
        </TouchableOpacity>
      </View>
      {/* caption content */}
      <View
        style={{
          marginVertical: 7,
        }}
      >
        <Pressable
          onPress={() =>
            console.log(
              "I need to display a full post, i think i should be another screen embeded in this homestack but i dont need it to be in presentaion mode..."
            )
          }
        >
          <Text
            style={{
              fontFamily: "overpass-reg",
            }}
            numberOfLines={2}
          >
            Hello wolrd im the first one to come and comment here and i want to
            show you how this issue is executed, Thank you sir i wish i will
            meet you soon and after that we'll have the good chart
          </Text>
          <View style={{ marginVertical: 10 }}>
            <Image
              source={
                image ? image : require("../assets/images/background/3.jpg")
              }
              resizeMode="cover"
              style={{
                width: "100%",
                height: 200,
                borderRadius: 15,
              }}
            />
          </View>
        </Pressable>
        {/* like and comments number */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: Platform.OS === "ios" ? "flex-start" : "center",
            }}
            onPress={() =>
              console.log(
                "Display who liked that post just a presentation screen to display them"
              )
            }
          >
            <AntDesign name="heart" size={16} color={COLORS.primary} />
            <Text
              style={{
                fontFamily: "overpass-reg",
                color: COLORS.primary,
                fontSize: 16,
                marginLeft: 5,
              }}
            >
              124
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              console.log(
                "Display drag top presentation screen to display comments"
              )
            }
          >
            <Text
              style={{
                fontFamily: "overpass-reg",
                color: COLORS.primary,
                fontSize: 16,
              }}
            >
              58 Comments
            </Text>
          </TouchableOpacity>
        </View>
        {/* like, commment, and share, lets use "grey" color for all icons and text in this box, but what i want to tell you 
                if that for like if someone like the post we should change fill heart with grey color to indicate that we have liked 
                the post, for design purpose i don't think we should need to use the dark grey color because we've already used it in
                above section to show how many comments and likes for that post.. */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          {/* like post */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: Platform.OS === "ios" ? "flex-start" : "center",
            }}
            onPress={() =>
              console.log("Just like the post/or dislike if i've already liked")
            }
          >
            <AntDesign name="hearto" size={20} color={COLORS.forthy} />
            <Text
              style={{
                fontFamily: "overpass-reg",
                color: COLORS.forthy,
                fontSize: 18,
                marginLeft: 5,
              }}
            >
              Like
            </Text>
          </TouchableOpacity>

          {/* comment post */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: Platform.OS === "ios" ? "flex-start" : "center",
            }}
            onPress={() =>
              console.log(
                "Just popup the presentation stacked screen to comment write the comment, if we can its okay to display other comments also"
              )
            }
          >
            <FontAwesome name="comment-o" size={20} color={COLORS.forthy} />
            <Text
              style={{
                fontFamily: "overpass-reg",
                color: COLORS.forthy,
                fontSize: 18,
                marginLeft: 5,
              }}
            >
              Comment
            </Text>
          </TouchableOpacity>

          {/* share it */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: Platform.OS === "ios" ? "flex-start" : "center",
            }}
            onPress={() => console.log("Just share the post")}
          >
            <AntDesign name="sharealt" size={20} color={COLORS.forthy} />
            <Text
              style={{
                fontFamily: "overpass-reg",
                color: COLORS.forthy,
                fontSize: 18,
                marginLeft: 5,
              }}
            >
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomLine color={COLORS.forthy} style={{ borderBottomWidth: 0.5 }} />
    </View>
  );
};

export const AboutCard = ({ colors, title, text, style, cancelHandler }) => {
  return (
    <LinearGradient
      style={[
        {
          height: 150,
          width: "100%",
          borderRadius: 15,
          padding: 30,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        },
        style,
      ]}
      start={{ x: -1, y: 0 }}
      end={{ x: 2, y: 0 }}
      colors={colors}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 10,
          right: 10,
        }}
        onPress={cancelHandler}
      >
        <AntDesign name="closecircle" size={23} color={COLORS.danger} />
      </TouchableOpacity>
      <Text
        style={{
          color: COLORS.thirdary,
          fontFamily: "montserrat-17",
          marginBottom: "2%",
          fontSize: 25,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontFamily: "overpass-reg",
          fontSize: 18,
          color: COLORS.thirdary,
        }}
      >
        {text}
      </Text>
    </LinearGradient>
  );
};

export const Background = ({ children, image, style }) => {
  return (
    <>
      <LinearGradient
        colors={["#000000", "#000000"]}
        style={[{ flex: 1 }, style && style]}
      >
        <ImageBackground
          style={{
            flex: 1,
          }}
          imageStyle={{ opacity: 0.5 }}
          source={image ? image : require("../assets/images/background/6.jpg")}
        >
          {children}
        </ImageBackground>
      </LinearGradient>
    </>
  );
};

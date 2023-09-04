import {
  View,
  ImageBackground,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { memo, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
//   import { domain } from "../../constants/domain";
import { BASE_URL } from "../constants/domain";
import { COLORS } from "../constants/colors";
const domain = BASE_URL;
const height = Dimensions.get("window").height;
import * as ImageCache from "react-native-expo-image-cache";
import { AppContext } from "../store/context";

function Banner({ profile, usergroup, moreData }) {
  const AppCtx = useContext(AppContext);

  const { width, height } = useWindowDimensions();

  let substrlimit = 12;

  if (width < 380) {
    substrlimit = 10;
  }

  if (width > 450 && width < 300) {
    substrlimit = 12;
  }

  if (width < 650 && width > 451) {
    substrlimit = 15;
  }

  if (width < 750 && width > 651) {
    substrlimit = 18;
  }

  if (width < 850 && width > 751) {
    substrlimit = 20;
  }

  if (width < 950 && width > 851) {
    substrlimit = 22;
  }

  if (width < 1050 && width > 951) {
    substrlimit = 30;
  }

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.lgContainer}
    >
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <ImageCache.Image
          {...{
            preview: {
              uri: `${BASE_URL}${AppCtx.usermetadata.get_image}`,
            },
            uri: `${BASE_URL}${AppCtx.usermetadata.get_image}`,
          }}
          style={[styles.imgBack]}
          imageStyle={{ opacity: 0.15, flex: 1 }}
        />

        <View
          style={[
            styles.wrapperView,
            {
              flex: 1,
              position: "absolute",
              bottom: 0,
              left: 0,
              paddingTop: 20,
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          ]}
        >
          <View style={styles.innerWrapperView}>
            <View style={styles.conte}>
              <View style={styles.textHolder}>
                <Text numberOfLines={1} style={styles.nameText}>
                  {profile.name}
                </Text>
                <Text style={styles.sub}>
                  {profile.usergroup.replace(
                    profile.usergroup[0],
                    profile.usergroup[0].toUpperCase()
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* </ImageBackground> */}
    </LinearGradient>
  );
}

export default Banner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lgContainer: {
    flex: 0.3,
  },
  firstContainer: {
    marginTop: 5,
    backgroundColor: "#f0f0f5",
  },
  secondContainer: {
    marginTop: 5,
    backgroundColor: "#f0f0f5",
  },
  drawerItemsContainer: {
    margin: 0,
    padding: 0,
  },

  parentOuterView: {
    flex: 1,
  },
  outerView: {
    flex: 1,
  },
  imgBack: {
    flex: 1,
  },
  title: {
    fontFamily: "montserrat-17",
    textAlign: "center",
    color: "white",
    fontSize: 25,
  },

  textHolder: {
    marginLeft: 10,
  },
  nameText: {
    fontFamily: "overpass-reg",
    fontSize: 20,
    color: "white",
  },
  sub: {
    fontFamily: "montserrat-17",
    fontSize: 15,
    color: "white",
  },
  wrapperView: {
    flex: 1,

    // marginBottom: deviceHeight < 700 ? 15 : 30,
  },
  innerWrapperView: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  bottomView: {
    flexDirection: "row",
    alignItems: "center",
  },
  conte: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imageProfile: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#55A630",
  },
  authButtonContainer: {
    alignItems: "center",
  },
  increasedMarginTop: {
    marginTop: height < 700 ? 15 : 20,
  },
  followContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
});

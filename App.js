import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  BackHandler,
  useWindowDimensions,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { useContext } from "react";
import { COLORS } from "./constants/colors";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/BottomTabs/HomeStack/HomeScreen";
import Notification from "./screens/BottomTabs/NotificationStack/Notification";
import PostScreen from "./screens/BottomTabs/PostStack/PostScreen";
import AppContextProvider, { AppContext } from "./store/context";
import { LoadingSpinner } from "./components/Ui";
import VersionCheck from "react-native-version-check";
import NetInfo from "@react-native-community/netinfo";
import { Animation } from "./components/Ui";
import ChatScreen from "./screens/BottomTabs/ChatStack/ChatScreen";
import ProfileScreen from "./screens/BottomTabs/ProfileStack/ProfileScreen";
import RegisterScreen from "./screens/BottomTabs/ProfileStack/Auth/RegisterScreen";
import LoginScreen from "./screens/BottomTabs/ProfileStack/Auth/LoginScreen";
import MkulimaProfile from "./screens/BottomTabs/ProfileStack/Profiles/MkulimaProfile";
import ResearcherProfile from "./screens/BottomTabs/ProfileStack/Profiles/ResearcherProfile";
import OfficerProfile from "./screens/BottomTabs/ProfileStack/Profiles/OfficerProfile";
import EnterOTPScreen from "./screens/BottomTabs/ProfileStack/Auth/EnterOTPScreen";
import SetPinScreen from "./screens/BottomTabs/ProfileStack/Auth/SetPinScreen";
import { _cacheResourcesAsync } from "./utils";
import WaitingAdminVerification from "./screens/BottomTabs/ProfileStack/WaitingAdminVerification";
import CompleteResearcherProfile from "./screens/BottomTabs/ProfileStack/Profiles/CompleteResearcherProfile";
import CompleteOfficerProfile from "./screens/BottomTabs/ProfileStack/Profiles/CompleteOfficerProfile";
import ResearcherDrawerContent from "./screens/BottomTabs/ProfileStack/Profiles/ResearcherDrawer/CustomDrawerContent";
import OfficerDrawerContent from "./screens/BottomTabs/ProfileStack/Profiles/OfficerDrawer/CustomDrawer";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Dashboard from "./screens/OfficerTopTabs/Dashboard";
import Researches from "./screens/OfficerTopTabs/Reseaches";
import QuestionAnswers from "./screens/OfficerTopTabs/QuestionAnswers";
import CreateArticle from "./screens/Researcher/CreateArticle";
import ViewEditArticle from "./screens/Researcher/ViewEditArticle";
import Pure from "./screens/OfficerTopTabs/Reseaches/TopTabs/Pure";
import Draft from "./screens/OfficerTopTabs/Reseaches/TopTabs/Draft";

const Stack = createNativeStackNavigator();
const Stack1 = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
function TabIcon({ focused, color, size, name }) {
  return <Ionicons color={focused ? color : "grey"} name={name} size={size} />;
}

// Researcher Drawer
function ResearcherDrawer() {
  const AppCtx = useContext(AppContext);
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <ResearcherDrawerContent
          {...props}
          moreData={undefined}
          profile={AppCtx.usermetadata}
          usergroup="Researcher"
        />
      )}
    >
      <Drawer.Screen
        options={{
          headerTintColor: COLORS.primary,
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
          title: "Dashboard",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.thirdary,
            // borderBottomWidth: 0.4,
            borderBottomColor: "grey",
          },
        }}
        name="ResearcherDashboard"
        component={ResearcherStack}
      />
    </Drawer.Navigator>
  );
}

// Officer Drawer
function OfficerDrawer() {
  const AppCtx = useContext(AppContext);
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <OfficerDrawerContent
          {...props}
          moreData={undefined}
          profile={AppCtx.usermetadata}
          usergroup="Officer"
        />
      )}
    >
      <Drawer.Screen
        options={{
          headerTintColor: COLORS.primary,
          headerTitleStyle: {
            fontFamily: "montserrat-17",
          },
          title: "Dashboard",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.thirdary,
            // borderBottomWidth: 0.4,
            borderBottomColor: "grey",
          },
        }}
        name="OfficerDashboard"
        // component={OfficerProfile}
        component={OfficerTopTabs}
      />
    </Drawer.Navigator>
  );
}

// Researcher Profile Stack
function ResearcherStack({ navigation }) {
  const AppCtx = useContext(AppContext);

  return (
    <Stack1.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      <Stack1.Screen
        name="ResearcherProfileScreen"
        component={ResearcherProfile}
      />
      <Stack1.Screen
        options={{
          headerShown: true,
          headerTitle: "Create Article",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
            textTransform: "capitalize",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ResearcherProfileScreen");
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  marginLeft: 10,
                  fontFamily: "montserrat-17",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
        }}
        name="CreateArticle"
        component={CreateArticle}
      />
      <Stack1.Screen
        options={{
          headerShown: true,
          headerTitle: "Update Article",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
            textTransform: "capitalize",
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ResearcherProfileScreen");
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  marginLeft: 10,
                  fontFamily: "montserrat-17",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
        }}
        name="UpdateArticle"
        component={ViewEditArticle}
      />
    </Stack1.Navigator>
  );
}

// home stack
function HomeStack() {
  return (
    <Stack1.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack1.Screen name="HomeScreen" component={HomeScreen} />
    </Stack1.Navigator>
  );
}

// profile stack
function ProfileStack() {
  const AppCtx = useContext(AppContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />

      {!AppCtx.isAunthenticated && (
        <>
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="VerifyOTPScreen" component={EnterOTPScreen} />
          <Stack.Screen name="SetPinScreen" component={SetPinScreen} />
        </>
      )}

      {AppCtx.isAunthenticated && (
        <>
          <Stack.Screen
            options={({ navigation }) => ({
              headerShown: true,
              headerTitleAlign: "center",
              headerTintColor: COLORS.primary,
              headerLeft: () => (
                <TouchableOpacity
                  style={{
                    marginLeft: 15,
                  }}
                  onPress={() => navigation.navigate("ProfileScreen")}
                >
                  <Ionicons
                    name="arrow-back-outline"
                    size={25}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              ),
              headerStyle: {
                backgroundColor: COLORS.thirdary,
                borderBottomWidth: 0.4,
                borderBottomColor: "grey",
                fontFamily: "montserrat-17",
              },
              title: "Researcher Profile",
            })}
            name="CompleteResearcherProfile"
            component={CompleteResearcherProfile}
          />
          <Stack.Screen
            options={({ navigation }) => ({
              headerShown: true,
              headerTitleAlign: "center",
              headerTintColor: COLORS.primary,

              headerLeft: () => (
                <TouchableOpacity
                  style={{
                    marginLeft: 15,
                  }}
                  onPress={() => navigation.navigate("ProfileScreen")}
                >
                  <Ionicons
                    name="arrow-back-outline"
                    size={25}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              ),
              headerStyle: {
                backgroundColor: COLORS.thirdary,
                borderBottomWidth: 0.4,
                borderBottomColor: "grey",
                fontFamily: "montserrat-17",
              },
              title: "Officer Profile",
            })}
            name="CompleteOfficerProfile"
            component={CompleteOfficerProfile}
          />
        </>
      )}
      {AppCtx.isAunthenticated && (
        <>
          <Stack.Screen name="MkulimaProfile" component={MkulimaProfile} />
          <Stack.Screen name="ResearcherProfile" component={ResearcherDrawer} />
          <Stack.Screen name="OfficerProfile" component={OfficerDrawer} />
          <Stack.Screen
            name="WaitingVerification"
            component={WaitingAdminVerification}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: "center",
      alignItems: "center",
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

function OfficerResearchesTopTabs({ route }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "forth", title: "Pure" },
    { key: "fifth", title: "Drafts" },
  ]);

  return (
    <>
      <TabView
        renderTabBar={renderTabBar2.bind(this, layout)}
        navigationState={{ index, routes }}
        renderScene={renderScene2}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
}

const renderScene2 = SceneMap({
  forth: Pure,
  fifth: Draft,
});

const renderTabBar2 = (layout, props) => {
  const AppCtx = useContext(AppContext);

  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: COLORS.primary }}
      style={{ backgroundColor: "white" }}
      activeColor={COLORS.primary}
      inactiveColor="grey"
      renderBadge={({ route }) => {
        if (route.key === "forth") {
          return (
            <View
              style={{
                position: "absolute",
                left: -80,
                top: 7,
                backgroundColor: COLORS.primary,
                width: 20,
                height: 20,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  fontFamily: "montserrat-17",
                }}
              >
                {
                  AppCtx.rArticles.filter(
                    (article) => !article.is_draft && !article.get_is_published
                  ).length
                }
              </Text>
            </View>
          );
        }
        // only that he saved as draft, that's why we  have the field of drafted_by
        if (route.key === "fifth") {
          return (
            <View
              style={{
                position: "absolute",
                left: -70,
                top: 7,
                backgroundColor: COLORS.primary,
                width: 20,
                height: 20,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  fontFamily: "montserrat-17",
                }}
              >
                {
                  AppCtx.rArticles
                    .filter(
                      (article) => article.is_draft && !article.get_is_published
                    )
                    .filter(
                      (val) =>
                        +val.drafted_by === +AppCtx.usermetadata.get_user_id
                    ).length
                }
              </Text>
            </View>
          );
        }
      }}
      labelStyle={{
        textTransform: "capitalize",
        fontFamily: "montserrat-17",
      }}
    />
  );
};

function OfficerTopTabs({ route }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "first", title: "Dashboard" },
    { key: "second", title: "Researches" },
    { key: "third", title: "Q&A" },
  ]);

  return (
    <>
      <TabView
        renderTabBar={renderTabBar.bind(this, layout)}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
}

const renderScene = SceneMap({
  first: Dashboard,
  second: OfficerResearchesTopTabs,
  third: QuestionAnswers,
});

const renderTabBar = (layout, props) => {
  const AppCtx = useContext(AppContext);

  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: COLORS.primary }}
      style={{ backgroundColor: "white" }}
      scrollEnabled={true}
      activeColor={COLORS.primary}
      renderBadge={({ route }) => {
        if (route.key === "second") {
          return (
            <View
              style={{
                position: "absolute",
                left: -40,
                top: 3,
                backgroundColor: COLORS.primary,
                width: 20,
                height: 20,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  fontFamily: "montserrat-17",
                }}
              >
                {
                  AppCtx.rArticles.filter(
                    (article) => !article.get_is_published
                  ).length
                }
              </Text>
            </View>
          );
        }
      }}
      inactiveColor="grey"
      labelStyle={{ textTransform: "capitalize", fontFamily: "montserrat-17" }}
    />
  );
};

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        options={{
          headerShown: true,
          headerTitleAlign: "left",
          headerTintColor: COLORS.primary,
          headerStyle: {
            backgroundColor: COLORS.thirdary,
            borderBottomWidth: 0.4,
            borderBottomColor: "grey",
          },
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 15,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={25}
                color={COLORS.forthy}
              />
            </TouchableOpacity>
          ),

          title: "Home",
          tabBarIcon: ({ focused, size, color }) => (
            <TabIcon size={size} color={color} name="home" focused={focused} />
          ),
        }}
        name="HomeStack"
        component={HomeStack}
      />
      <Tab.Screen
        options={{
          title: "Notifications",
          headerShown: true,
          tabBarIcon: ({ focused, size, color }) => (
            <TabIcon
              size={size}
              color={color}
              name="notifications"
              focused={focused}
            />
          ),
        }}
        name="Notifications"
        component={Notification}
      />
      {/* <Tab.Screen
        options={{
          title: "Post",
          tabBarIcon: () => (
            <Image
              source={require("./assets/icons/plus.png")}
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
              }}
            />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
        name="Post"
        component={PostScreen}
      /> */}
      <Tab.Screen
        options={{
          title: "Chats",
          tabBarIcon: ({ focused, size, color }) => (
            <TabIcon
              size={size}
              color={color}
              name="chatbubble-ellipses"
              focused={focused}
            />
          ),
        }}
        name="Message"
        component={ChatScreen}
      />
      <Tab.Screen
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, size, color }) => (
            <TabIcon
              size={size}
              color={color}
              name="person"
              focused={focused}
            />
          ),
        }}
        name="ProfileStack"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MyTabs" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const NetworkCheck = ({ status, type }) => {
  return (
    <View style={styles.container}>
      <Animation
        style={{
          width: 220,
          alignSelf: "center",
          aspectRatio: 1,
        }}
        source={require("./assets/LottieAnimations/animation_lkffzc96.json")}
      />
    </View>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    "overpass-reg": require("./assets/fonts/personalyzer/Overpass-Regular.ttf"),
    "roboto-reg": require("./assets/fonts/personalyzer/Roboto-Regular.ttf"),
    "roboto-med": require("./assets/fonts/personalyzer/Roboto-MediumItalic.ttf"),
    "montserrat-1": require("./assets/fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf"),
    "montserrat-2": require("./assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf"),
    "montserrat-3": require("./assets/fonts/Montserrat/static/Montserrat-Black.ttf"),
    "montserrat-4": require("./assets/fonts/Montserrat/static/Montserrat-BlackItalic.ttf"),
    "montserrat-5": require("./assets/fonts/Montserrat/static/Montserrat-Bold.ttf"),
    "montserrat-6": require("./assets/fonts/Montserrat/static/Montserrat-BoldItalic.ttf"),
    "montserrat-7": require("./assets/fonts/Montserrat/static/Montserrat-ExtraBold.ttf"),
    "montserrat-8": require("./assets/fonts/Montserrat/static/Montserrat-ExtraBoldItalic.ttf"),
    "montserrat-9": require("./assets/fonts/Montserrat/static/Montserrat-ExtraLight.ttf"),
    "montserrat-10": require("./assets/fonts/Montserrat/static/Montserrat-ExtraLightItalic.ttf"),
    "montserrat-11": require("./assets/fonts/Montserrat/static/Montserrat-Italic.ttf"),
    "montserrat-12": require("./assets/fonts/Montserrat/static/Montserrat-Light.ttf"),
    "montserrat-13": require("./assets/fonts/Montserrat/static/Montserrat-LightItalic.ttf"),
    "montserrat-14": require("./assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    "montserrat-15": require("./assets/fonts/Montserrat/static/Montserrat-MediumItalic.ttf"),
    "montserrat-16": require("./assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "montserrat-17": require("./assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "montserrat-18": require("./assets/fonts/Montserrat/static/Montserrat-SemiBoldItalic.ttf"),
    "montserrat-19": require("./assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "montserrat-20": require("./assets/fonts/Montserrat/static/Montserrat-ThinItalic.ttf"),
  });

  const [connectionStatus, setConnectionStatus] = useState(false);
  const [connectionType, setConnectionType] = useState(null);
  const [needupdate, setNeedUpdate] = useState(false);
  const [stillCheckingVersion, setStillCheckingVersion] = useState(true);
  const [updateMetadata, setUpdateMetadata] = useState();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      await _cacheResourcesAsync();
      setAppIsReady(true);
    };
    loadResources();
  }, []);

  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
    return () => {
      netInfoSubscription && netInfoSubscription();
    };
  }, []);

  // this should be here after we have already ejected our project and build works fine
  // for now lets comment this out
  // useEffect(() => {
  //   checkVersion()
  // }, [])

  const handleNetworkChange = (state) => {
    setConnectionStatus(state.isConnected);
    setConnectionType(state.type);
  };

  const checkVersion = async () => {
    setStillCheckingVersion(true);
    let updateNeeded = await VersionCheck.needUpdate();
    setUpdateMetadata(updateNeeded);
    try {
      if (updateNeeded && updateNeeded.isNeeded) {
        setNeedUpdate(true);
        setStillCheckingVersion(false);
        Alert.alert(
          "Please Update",
          "You will have to update your app to the latest version to continue using.",
          [
            {
              text: "Update",
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl);
              },
            },
          ],
          {
            cancelable: false,
          }
        );
      } else {
        setNeedUpdate(false);
        setStillCheckingVersion(false);
      }
    } catch (error) {
      setStillCheckingVersion(false);
    }
  };

  if (!appIsReady || !fontsLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}
      >
        {connectionStatus ? (
          <AppContextProvider>
            <Navigation />
          </AppContextProvider>
        ) : (
          <NetworkCheck status={connectionStatus} type={connectionType} />
        )}
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});

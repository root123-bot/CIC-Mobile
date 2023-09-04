/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { memo, useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { View, FlatList } from "react-native";
import { Button, HelperText } from "react-native-paper";
// import KibandaCardCart from "../components/UI/KibandaCardCart";
import { TransparentPopUpIconMessage } from "../../../components/Messages";
// import NotificationCard from "../components/UI/NoficationCard";
// import { userNotifications } from "../utils/requests";
import { AppContext } from "../../../store/context";
import { COLORS } from "../../../constants/colors";
import { LoadingSpinner } from "../../../components/Ui";

function Notification({ navigation }) {
  const AppCtx = useContext(AppContext);
  const { cart } = AppCtx;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  //   const refreshHandler = async () => {
  //     fetchNotification();
  //   };

  //   const fetchNotification = async () => {
  //     setLoading(true);
  //     try {
  //       const notifications = await userNotifications(
  //         AppCtx.usermetadata.get_user_id
  //       );
  //       setNotifications(notifications);
  //       AppCtx.updateusernotifications(notifications);
  //     } catch (error) {
  //       // alert("Error : ", error.message)
  //     }
  //     setLoading(false);
  //   };

  //   useEffect(() => {
  //     if (AppCtx.clearAllNotificationLoading) {
  //       fetchNotification();
  //     }
  //   }, [AppCtx.clearAllNotificationLoading]);

  //   useEffect(() => {
  //     fetchNotification();
  //   }, []);

  {
    !notifications && (
      <View
        style={{
          flex: 1,
        }}
      >
        <LoadingSpinner />
      </View>
    );
  }

  // hapa itabidi nitumie ListView ili mtu awe na uweza wa ku-refresh for notifications..
  return (
    <>
      <StatusBar style="dark" />
      {!AppCtx.isAunthenticated ? (
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "overpass-reg",
              fontSize: 20,
              color: "grey",
            }}
          >
            Login to view notifications
          </Text>
          <Button
            style={{
              marginVertical: 20,
            }}
            labelStyle={{
              fontFamily: "montserrat-17",
            }}
            contentStyle={{
              backgroundColor: COLORS.secondary,
            }}
            mode="contained"
            onPress={() => navigation.navigate("Login")}
          >
            Login here
          </Button>
        </View>
      ) : (
        notifications.length === 0 && (
          <View
            style={{
              position: "absolute",
              top: "50%",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "overpass-reg",
                textAlign: "center",
                fontSize: 16,
                color: "grey",
              }}
            >
              No notifcation yet
            </Text>
            <HelperText
              padding="none"
              style={{
                textAlign: "center",
                fontFamily: "overpass-reg",
              }}
            >
              Drag down to refresh
            </HelperText>
          </View>
        )
      )}
    </>
  );
}

export default memo(Notification);

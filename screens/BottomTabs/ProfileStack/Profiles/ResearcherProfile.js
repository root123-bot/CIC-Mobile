import React, { memo, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DashboardCard from "../../../../components/DashboardCard";
import { COLORS } from "../../../../constants/colors";
import { SearchBar } from "@rneui/themed";
import DataTable from "../../../../components/DataTable";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@muratoner/semantic-ui-react-native";
import { AppContext } from "../../../../store/context";
import ActionButton from "react-native-action-button";
// import Icon from "react-native-vector-icons/Ionicons";

function ResearcherProfile({ navigation }) {
  const AppCtx = useContext(AppContext);

  const [search, setSearch] = useState("");
  const [data, setData] = useState(AppCtx.userrawpost);

  useEffect(() => {
    setData(AppCtx.userrawpost);
  }, [AppCtx.userrawpost.length]);

  const searchHandler = (text) => {
    setSearch(text);

    const result = AppCtx.userrawpost.filter((item) => {
      return (
        item.title.toLowerCase().includes(text.toLowerCase()) ||
        item.date_posted
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-")
          .includes(text.toLowerCase())
      );
    });

    // set the data passed to the table
    setData(result);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cardHolder}>
        <DashboardCard
          gradientColors={[COLORS.primary, COLORS.secondary]}
          title="Total Added"
          subtitle="Articles"
          number={AppCtx.userrawpost.length}
        />
        <DashboardCard
          gradientColors={[COLORS.primary, COLORS.secondary]}
          title="Published"
          subtitle="Articles"
          style={{ marginLeft: "2%" }}
          number={0}
        />
      </View>

      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.tableHolder}
      >
        {/* <View
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
          }}
        >
          <Text>Hello</Text>
        </View> */}
        <View
          style={{
            zIndex: 100,
            position: "absolute",
            right: 20,
            bottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CreateArticle");
            }}
          >
            <Icon size={50} name="add-circle" color={COLORS.thirdary} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerHolder}>
          <Text style={styles.header}>{"ALL ARTICLES"}</Text>
          {/* <TouchableOpacity
            style={styles.addNew}
            onPress={() => {
              navigation.navigate("CreateArticle");
            }}
          >
            <Icon name="add" style={styles.headerIcon} />
          </TouchableOpacity> */}
        </View>
        {AppCtx.userrawpost.length > 0 ? (
          <>
            <View style={{ marginTop: "2%" }}>
              <SearchBar
                platform={Platform.OS === "ios" ? "ios" : "default"}
                showCancel={false}
                round
                placeholder="Search..."
                light
                autoCorrect={false}
                placeholderTextColor={COLORS.primary}
                leftIcon={{ color: COLORS.primary }}
                inputContainerStyle={{
                  height: 20,
                  fontFamily: "montserrat-17",
                }}
                inputStyle={{
                  fontFamily: "montserrat-17",
                  fontSize: 14,
                  color: COLORS.primary,
                }}
                onChangeText={searchHandler}
                value={search}
                cancelButtonTitle=""
                containerStyle={{
                  backgroundColor: "transparent",
                  borderBottomColor: "transparent",
                  borderTopColor: "transparent",

                  marginHorizontal: "2%",
                }}
              />
            </View>
            <ScrollView style={styles.innerTableHolder}>
              <DataTable data={data} />
            </ScrollView>
          </>
        ) : (
          <View
            style={{
              height: 100,
              marginHorizontal: "5%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "montserrat-17",
                fontSize: 16,
                color: "white",
                textAlign: "center",
              }}
            >
              No articles added yet
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

export default memo(ResearcherProfile);

const styles = StyleSheet.create({
  cardHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "2%",
    marginTop: "5%",
    flex: 0.2,
  },
  tableHolder: {
    flex: 0.75,
    maxHeight: "100%",
    margin: "2%",
    marginTop: "5%",
    borderRadius: 15,
  },
  innerTableHolder: {
    margin: "4%",
    marginTop: "2%",
  },
  header: {
    fontFamily: "montserrat-17",
    fontSize: 20,
    color: "white",
    textTransform: "uppercase",
    marginLeft: "2%",
  },
  headerIcon: {
    fontFamily: "montserrat-17",
    fontSize: 20,
    color: "white",
    textTransform: "uppercase",
    marginLeft: "2%",
    color: "#55A630",
  },
  headerHolder: {
    marginHorizontal: "4%",
    marginTop: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addNew: {
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

import React, { memo, useContext } from "react";
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

function ResearcherProfile({ navigation }) {
  const AppCtx = useContext(AppContext);
  console.log("App context ", AppCtx.userrawpost);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cardHolder}>
        <DashboardCard
          gradientColors={[COLORS.primary, COLORS.secondary]}
          title="Total Added"
          subtitle="Articles"
          number={0}
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
        <View style={styles.headerHolder}>
          <Text style={styles.header}>{"ALL ARTICLES"}</Text>
          <TouchableOpacity
            style={styles.addNew}
            onPress={() => {
              navigation.navigate("CreateArticle");
            }}
          >
            <Icon name="add" style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
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
            onChangeText={() => console.log("Hello world")}
            value={"search"}
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
          <DataTable data={AppCtx.userrawpost} />
        </ScrollView>
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

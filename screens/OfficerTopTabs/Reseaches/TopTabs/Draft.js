import React, { useState, useEffect, useContext, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HelperText } from "react-native-paper";
import { AppContext } from "../../../../store/context";
import { SearchBar } from "@rneui/themed";
import { Icon } from "@muratoner/semantic-ui-react-native";
import { COLORS } from "../../../../constants/colors";
import DataTable3 from "../../../../components/DataTable3";

function DraftResearches() {
  const AppCtx = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(
    AppCtx.rArticles
      .filter((article) => article.is_draft)
      .filter((val) => +val.drafted_by === +AppCtx.usermetadata.get_user_id)
  );

  useEffect(() => {
    AppCtx.rArticles
      .filter((article) => article.is_draft)
      .filter((val) => +val.drafted_by === +AppCtx.usermetadata.get_user_id);
  }, [AppCtx.rArticles.length]);

  const searchHandler = (text) => {
    setSearch(text);

    const result = AppCtx.rArticles
      .filter((article) => article.is_draft)
      .filter((val) => +val.drafted_by === +AppCtx.usermetadata.get_user_id)
      .filter((item) => {
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
    <View
      style={{
        flex: 1,
      }}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.tableHolder}
      >
        <View style={styles.headerHolder}>
          <Text style={styles.header}>{"ALL DRAFTED RESEARCHES"}</Text>
          <HelperText
            padding={false}
            style={{
              fontFamily: "overpass-reg",
              fontSize: 12,
              color: "white",
            }}
          >
            ** You saved them as drafts.
          </HelperText>
        </View>
        {AppCtx.rArticles
          .filter((article) => article.is_draft)
          .filter((val) => +val.drafted_by === +AppCtx.usermetadata.get_user_id)
          .length > 0 ? (
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
              <DataTable3 data={data} />
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
              No drafts added yet
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

export default memo(DraftResearches);

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
    flex: 0.95,
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

import { Text, View, StyleSheet, Platform } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CustomLine } from "./Ui";
import { COLORS } from "../constants/colors";

function DataTable2({ data, onTapHandler }) {
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.tableHeaderView}>
        <View style={[styles.innerContainer, { width: "37%" }]}>
          <View>
            <Text style={styles.header}>Title</Text>
          </View>
          {Platform.OS === "ios" && (
            <CustomLine color={COLORS.thirdary} style={styles.hr} />
          )}
          {/* title */}
          {data
            .map((val) => ({ title: val.title, id: val.id }))
            .map((value, index) => {
              return (
                <View key={`${index * Math.random()}.FO`}>
                  <TouchableOpacity
                    onPress={onTapHandler.bind(this, value.id)}
                    style={{ paddingVertical: 5 }}
                  >
                    <View style={[styles.columnHolder]}>
                      <Text numberOfLines={1} style={styles.colValue}>
                        {value.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {Platform.OS === "ios" && (
                    <CustomLine color={COLORS.thirdary} style={styles.hr} />
                  )}
                </View>
              );
            })}
        </View>
        <View style={[styles.innerContainer, { width: "37%" }]}>
          <View>
            <Text style={styles.header} numberOfLines={1}>
              Researcher
            </Text>
          </View>
          {Platform.OS === "ios" && (
            <CustomLine color={COLORS.thirdary} style={styles.hr} />
          )}

          {/* is published */}
          {data
            .map((val) => val.get_researcher.username)
            .map((value, index) => (
              <View key={`${index * Math.random()}.FO`}>
                <TouchableOpacity style={{ paddingVertical: 5 }}>
                  <View style={[styles.columnHolder]}>
                    <Text numberOfLines={1} style={[styles.colValue]}>
                      {value}
                    </Text>
                  </View>
                </TouchableOpacity>
                {Platform.OS === "ios" && (
                  <CustomLine color={COLORS.thirdary} style={styles.hr} />
                )}
              </View>
            ))}
        </View>
        <View style={[styles.innerContainer, { width: "26%" }]}>
          <View>
            <Text numberOfLines={1} style={styles.header}>
              Date Updated
            </Text>
          </View>
          {Platform.OS === "ios" && (
            <CustomLine color={COLORS.thirdary} style={styles.hr} />
          )}

          {/* my date data */}
          {data
            .map((val) => ({
              date_posted: val.date_posted,
              id: val.id,
              date_updated: val.date_updated,
            }))
            .map((value, index) => (
              <View key={`${index * Math.random()}.FO`}>
                <TouchableOpacity
                  style={{ paddingVertical: 5 }}
                  onPress={() => {
                    console.log("Article id ", value.id);
                    navigate.navigate("UpdateArticle", {
                      articleId: value.id,
                    });
                  }}
                >
                  <View style={[styles.columnHolder]}>
                    <Text numberOfLines={1} style={styles.colValue}>
                      {`${value.date_updated
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")}`}
                    </Text>
                  </View>
                </TouchableOpacity>
                {Platform.OS === "ios" && (
                  <CustomLine color={COLORS.thirdary} style={styles.hr} />
                )}
              </View>
            ))}
        </View>
      </View>
    </View>
  );
}

export default DataTable2;

const styles = StyleSheet.create({
  hr: {
    marginBottom: 0,
  },
  tableHeaderView: {
    flexDirection: "row",
  },
  innerContainer: {
    width: "33%",
  },
  header: {
    fontFamily: "montserrat-17",
    color: "#fff",
    padding: 10,
    textTransform: "capitalize",
    // whiteSpace: "nowrap",  // nowrap whiteSpace can be set using the numberOfLines prop of Text
  },
  columnHolder: {
    padding: 10,
  },
  colValue: {
    fontFamily: "montserrat-14",
    color: "#fff",
    fontSize: 12,
    textTransform: "uppercase",
  },
});

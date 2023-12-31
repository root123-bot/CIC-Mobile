import { Text, View, StyleSheet, Platform } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CustomLine } from "./Ui";
import { COLORS } from "../constants/colors";

function DataTable({ data }) {
  console.log("Data ", data);
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
            .map((val) => {
              return {
                title: val.title,
                id: val.id,
                isDrafted: val.is_draft,
                isPublished: val.get_is_published,
              };
            })
            .map((value, index) => (
              <View key={`${index * Math.random()}.FO`}>
                <TouchableOpacity
                  onPress={() => {
                    console.log("Article id ", value.id);
                    // first check if the article is drafted or not...

                    // if (value.isDrafted || value.isPublished) {
                    //   // you can't update the article stared published/drafted by officer
                    //   return alert(
                    //     "You can't edit this article because it is already published or drafted by officer"
                    //   );
                    // }

                    navigation.navigate("UpdateArticle", {
                      articleId: value.id,
                    });
                  }}
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
            ))}
        </View>
        <View style={[styles.innerContainer, { width: "37%" }]}>
          <View>
            <Text style={styles.header} numberOfLines={1}>
              Is Published
            </Text>
          </View>
          {Platform.OS === "ios" && (
            <CustomLine color={COLORS.thirdary} style={styles.hr} />
          )}

          {/* is published */}
          {data
            .map((val) => val.title)
            .map((value, index) => (
              <View key={`${index * Math.random()}.FO`}>
                <TouchableOpacity style={{ paddingVertical: 5 }}>
                  <View style={[styles.columnHolder]}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.colValue,
                        { textAlign: "left", marginLeft: "25%" },
                      ]}
                    >
                      {"No"}
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
              Date
            </Text>
          </View>
          {Platform.OS === "ios" && (
            <CustomLine color={COLORS.thirdary} style={styles.hr} />
          )}

          {/* my date data */}
          {data
            .map((val) => ({ date_posted: val.date_posted, id: val.id }))
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
                      {`${value.date_posted
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

export default DataTable;

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

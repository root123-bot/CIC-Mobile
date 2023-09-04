import Icon from "react-native-vector-icons/MaterialIcons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { launchCameraAsync } from "expo-image-picker";

function UploadFile({ fileHandler, isValid }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [filename, setFileName] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [loading, setLoading] = useState(false);

  async function scanDocument() {
    setModalVisible(false);
    try {
      // set loading..
      setLoading(true);
      const response = await launchCameraAsync({
        quality: 0.5,
      });

      if (!response.canceled) {
        console.log("this is response extract from document picker", response);
        fileHandler({
          response,
          name: "scanned-document",
        });
        setFileName("scanned");
        setFileExtension("jpg");
      }
      //   set loading false
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      //   set loading false
    }
  }

  async function selectFile() {
    setModalVisible(false);
    try {
      // set loading..
      setLoading(true);
      const response = await DocumentPicker.getDocumentAsync({
        type: "/",
        copyToCacheDirectory: true,
      });

      if (response.type === "success") {
        console.log("this is response extract from document picker", response);
        fileHandler({
          response,
          name: "attached-document",
        });
        setFile(response);
        let fname = response.name.split(".");
        fname.pop();
        setFileName(fname.join("."));
        setFileExtension(response.name.split(".").pop());
      }
      //   set loading false
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      //   set loading false
    }
  }

  return (
    <View style={styles.container}>
      {/* onPress={selectFile */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.attachFile}>
          <Icon name="attach-file" size={12} color="#55A630" />
          <Text style={{ color: "#55A630" }}>Attach/Scan Certificate</Text>

          {!isValid && (
            <Icon
              name="info"
              size={13}
              color="#EF233C"
              style={{ marginLeft: "2%" }}
            />
          )}
        </View>
      </TouchableOpacity>
      <Modal
        style={{
          flex: 1,
          width: "80%",
          height: "50",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "50%",
          backgroundColor: "grey",
        }}
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => {
          setLoading(false);
          setModalVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              height: 220,
              borderRadius: 10,
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "90%",
              backgroundColor: "grey",
            }}
          >
            <View style={{ flexDirection: "row", flex: 1 }}>
              <View
                style={{
                  width: "48%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={selectFile}>
                  <Image
                    source={require("../assets/images/attachment.png")}
                    style={{
                      width: 50,
                      height: 50,
                      alignSelf: "center",
                    }}
                  />
                  <Text
                    style={{
                      color: "#55A630",
                      fontFamily: "montserrat-17",
                      color: "white",
                      textAlign: "center",
                      fontSize: 15,
                    }}
                  >
                    Attach Certificate
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "48%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={scanDocument}>
                  <Image
                    source={require("../assets/images/scanner.png")}
                    style={{
                      width: 50,
                      height: 50,
                      alignSelf: "center",
                    }}
                  />
                  <Text
                    style={{
                      color: "#55A630",
                      fontFamily: "montserrat-17",
                      color: "white",
                      textAlign: "center",
                      fontSize: 15,
                    }}
                  >
                    Scan Certificate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {loading ? (
        <View style={{ marginRight: "5%" }}>
          <ActivityIndicator animating={true} color="#55A630" />
        </View>
      ) : (
        <View style={styles.fileHolder}>
          {filename.length > 0 ? (
            <>
              <Text style={styles.fname}>
                {filename.length > 15
                  ? filename.substring(0, 12) + "..." + fileExtension
                  : filename + "." + fileExtension}
              </Text>
              <Text style={styles.hint}>Attached</Text>
            </>
          ) : (
            <></>
          )}
        </View>
      )}
    </View>
  );
}

export default UploadFile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "2%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fileHolder: {
    flexDirection: "row",
    alignItems: "center",
  },
  fname: {
    fontFamily: "montserrat-14",
    fontSize: 12,
  },
  hint: {
    color: "#55A630",
    marginLeft: "2%",
    textTransform: "uppercase",
    fontSize: 10,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#55A630",
    backgroundColor: "#9EF01A",
  },
  attachFile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

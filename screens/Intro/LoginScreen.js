import { StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import Form from "../../components/Form";

// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

function Login() {
  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* https://stackoverflow.com/questions/45466026/keyboard-aware-scroll-view-android-issue ,
                    https://youtu.be/dRiokYGztBA */}
        <Form
          title="LOGIN HERE"
          image={require("../../assets/images/fert.png")}
          icon="login"
          isLogin={true}
        />
      </SafeAreaView>
    </>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

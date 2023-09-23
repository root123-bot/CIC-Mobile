import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Image,
  Text,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
// import {
//   fetchToken,
//   registergatherman,
//   userstatus,
//   loginGatherman,
//   isUserActive,
// } from "../utils/requests";
// import { ToastNotification } from "./Message";
import { ToastNotification } from "./Messages";
// import jwt_decode from "jwt-decode";
import { AppContext } from "../store/context";

function Form({ image, icon, title, isLogin }) {
  const myAppCtx = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [eyeIcon, setEyeIcon] = useState("eye");
  const [loading, setLoading] = useState();
  const [showAnimation, setShowAnimation] = useState(false);
  const [messageHeader, setMessageHeader] = useState("");
  const [messageDescription, setMessageDescription] = useState("");
  const [messageColor, setMessageColor] = useState("#003049");

  {
    /* 
    kaka nimejaribu ku-clear timeout using useEffect return, but it
    make the 'settimeout' to now work, i think in react native we don't
    clear the timeout, ... Hichi kitu inabidi ukijue mzee
  
    useEffect(() => {
      return () => {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }
      };
    });
  */
  }

  function accountHandler() {
    if (!email.trim() || !password.trim()) {
      alert("Please fill all the fields");
      return;
    }
    if (isLogin) {
      setLoading(true);
      console.log(email, password);
      // setMessageHeader("Error");
      // setMessageDescription("Something went wrong...");
      // setMessageColor("#BC4749");
      // setShowAnimation(!showAnimation);
      loginGatherman(email, password)
        .then((token) => {
          console.log("token ", token, typeof token);
          // lets send this to the aunthenticate user but it want the token to be stringfied...
          if (token.detail) {
            console.log("fuck you");
            // this means the user is not found...
            // setLoading(false);
            // return alert("User not found");

            isUserActive(email).then((data) => {
              if (data.details) {
                // console.log("user is not found");
                alert("User not found");
                setLoading(false);
                return;
              }
              // console.log(data, " i receive this");
              if (data.status) {
                // user is found but inactive..
                setLoading(false);
                setEmail("");
                setPassword("");
                navigation.navigate("UnderReviewScreen");
              }
            });
          }
          token = JSON.stringify(token);
          myAppCtx.authenticate(token);
        })
        .catch((err) => {
          console.log("error ", err);
          alert("Something went wrong");
          setLoading(false);
        });
    } else {
      setLoading(true);
      registergatherman(email, password, "Gatherman")
        .then((data) => {
          {
            /* 
                we should login-the user and redirect them to the complete profile
                screen, no need to save 'token' in localstorage bcoz we only need 
                users who is reviewed by the 'admin'
            */
          }
          if (data.err) {
            {
              /* this data will contain the object of {err: 'something ...'}
                         this is how to return Error in Promise based function, we do 
                         this by using .reject() which is the same to 'Error' and this 
                         error here will be catched by the .catch() block...
                        */
            }
            return Promise.reject(data.err);
          }
          // show 'message' of succesful.. login that user store the token in localstorage
          // send post request to the api/token ...
          fetchToken(email, password)
            .then((data) => {
              const token = data;
              const user_id = jwt_decode(token.access).user_id;
              userstatus(user_id)
                .then((dt) => {
                  const status = dt.status;
                  // store that user status, token and user_id in context...
                  // before we store that in user starage...
                  myAppCtx.manipulateUserData({
                    token: token,
                    user_id: user_id,
                    user_status: status,
                  });
                  // store that token in our localstorage...
                  AsyncStorage.setItem("token", JSON.stringify(token));
                  // we should re-direct the user to 'complete' profile screen.
                  setMessageHeader("Success");
                  setMessageDescription(
                    "Account have been created successfully..."
                  );
                  Keyboard.dismiss();
                  setMessageColor("#84DCC6");
                  setShowAnimation(!showAnimation);
                  setTimeout(() => {
                    setShowAnimation(false);
                    navigation.navigate("CompleteProfileScreen");
                    setLoading(false);
                  }, 2000);
                })
                .catch((err) => {
                  // unable to fetch user_id
                  console.log("user status error ", err);
                });
            })

            .catch((err) => {
              // in most case if it failed to fetch/post that data to API it can be because of internet of our server or our url is wrong, but if we're good the reason is
              // user internet connection...
              setMessageHeader("Error");
              setMessageDescription("Something went wrong...");
              setMessageColor("#BC4749");
              setShowAnimation(!showAnimation);
              setTimeout(() => {
                setShowAnimation(false);
              }, 3000);

              setLoading(false);
            });
        })
        .catch((err) => {
          Keyboard.dismiss();

          if (err === "UNIQUE constraint failed: register_customuser.email") {
            err = "Email already exists, please login";
          }
          setMessageHeader("Error");
          setMessageDescription(err);
          setMessageColor("#BC4749");
          setShowAnimation(!showAnimation);

          {
            /* 
            kaka nimejaribu ku-clear timeout using useEffect return, but it
            make the 'settimeout' to now work, i think in react native we don't
            clear the timeout, ... Hichi kitu inabidi ukijue mzee
          */
          }
          setTimeout(() => {
            setShowAnimation(false);
          }, 3000);
          setEmail("");
          setPassword("");
          setLoading(false);
        });
    }
    // console.log(email, password);
  }

  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      {showAnimation && (
        <ToastNotification
          color={messageColor}
          messageHeader={messageHeader}
          messageDescription={messageDescription}
        />
      )}
      <KeyboardAvoidingView style={styles.formContainer} behavior="padding">
        <Image source={image} style={styles.img} />
        <Text style={styles.header}>{title}</Text>
        {/* <Text style={styles.subHeader}>Gatherman</Text> */}

        <TextInput
          keyboardType="email-address"
          mode="outlined"
          outlineColor="#55A630"
          activeOutlineColor="#55A630"
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCorrect={false}
          style={styles.formInput}
        />
        <TextInput
          mode="outlined"
          outlineColor="#55A630"
          activeOutlineColor="#55A630"
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          autoCorrect={false}
          secureTextEntry={secureText}
          style={styles.formInput}
          right={
            <TextInput.Icon
              onPress={() => {
                setSecureText(!secureText);
                eyeIcon === "eye" ? setEyeIcon("eye-off") : setEyeIcon("eye");
              }}
              icon={eyeIcon}
            />
          }
        />
        {isLogin && (
          <></>
          // <Text
          //   style={styles.fpbtn}
          //   onPress={() => navigation.navigate("ResetPassword")}
          // >
          //   Forgot Password?
          // </Text>
        )}
        <Button
          icon={icon}
          iconColor="#fff"
          mode="contained"
          loading={loading}
          style={styles.iconBtn}
          buttonColor="#55A630"
          // onPress={accountHandler}
        >
          {isLogin ? "Login" : "Register"}
        </Button>
        {isLogin ? (
          <Text style={styles.fullText}>
            You don't have account?{" "}
            <Text
              onPress={() => navigation.navigate("RegisterScreen")}
              style={styles.regBtn}
            >
              Register here
            </Text>
          </Text>
        ) : (
          <Text style={styles.fullText}>
            Already have account?{" "}
            <Text
              onPress={() => navigation.navigate("LoginScreen")}
              style={styles.regBtn}
            >
              Login here
            </Text>
          </Text>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  imgContainer: {
    flex: 1,
    // marginTop: '10%',  // hii sio kazi yetu ku-set hivi ilibidi iji-adjust yenyewe..
    alignItems: "center",
  },
  formContainer: {
    flex: 1,
    width: "85%",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 250,
    height: 250,
  },
  header: {
    fontFamily: "lato-black",
    fontSize: 25,
    color: "#55A630",
    marginTop: "5%",
  },
  formInput: {
    width: "100%",
    marginTop: "2%",
  },
  iconBtn: {
    width: "100%",
    marginTop: "2%",
  },
  fpbtn: {
    color: "#BC4749",
    fontFamily: "lato-black",
    marginVertical: "2%",
    width: "100%",
    textAlign: "right",
  },
  dhaContaienr: {
    flex: 1,
    width: "100%",
  },
  fullText: {
    width: "100%",
    textAlign: "right",
  },
  regBtn: {
    color: "#BC4749",
    fontFamily: "lato-black",
    margin: 20,
  },
  subHeader: {
    fontFamily: "lato-regular",
  },
});

export default Form;

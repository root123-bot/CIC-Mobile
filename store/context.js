import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL } from "../constants/domain";
import { ResearcherArticles } from "../utils/requests";

export const AppContext = createContext({
  isAunthenticated: false,
  usermetadata: {},
  toggleOnAbout: true,
  registermetadata: {},
  alreadyValidated: false,
  lastLoginPhoneNumber: null,
  stillExecutingUserMetadata: true,
  isSettingInactive: false,
  userrawpost: [],
  rArticles: [],
  officerposts: [],
  articleUpdated: 0,
  activeFilter: "all",
  logout: () => {},
  manipulateUserMetadata: (metadata) => {},
  manipulateIsAunthenticated: (status) => {},
  manipulateToggleOnAbout: (status) => {},
  addRegisterMetadata: (metadata) => {},
  clearRegisterMetadata: () => {},
  manipulateAlreadyValidated: (status) => {},
  manipulateLastLoginPhoneNumber: (phone_number) => {},
  manipulateIsSettingInactive: (status) => {},
  updateUserRawPost: (posts) => {},
  manipulateUserRawPost: (post) => {},
  manipulateRArticles: (article) => {},
  updateRArticles: (articles) => {},
  manipulateOfficerPosts: (post) => {},
  updateOfficerPosts: (posts) => {},
  manipulateArticleUpdated: (status) => {},
  incrementArticleUpdated: () => {},
  makeArticleDrafted: (article) => {},
  likeRArticle: (article) => {},
  unlikeRArticle: (article) => {},
  commentArticle: (metadata) => {},
  manipulateActiveFilter: (filter) => {},
});

function AppContextProvider({ children }) {
  const [rArticles, setRArticles] = useState([]); // this is for researcher articles
  const [officerposts, setOfficerPosts] = useState([]); // this is for officer posts
  const [usermetadata, setUserMetadata] = useState({});
  const [isAunthenticated, setIsAunthenticated] = useState();
  const [toggleOnAbout, setToggleOnAbout] = useState(true);
  const [registermetadata, setRegisterMetadata] = useState({});
  const [alreadyValidated, setAlreadyValidated] = useState(false);
  const [lastLoginPhoneNumber, setLastLoginPhoneNumber] = useState(null);
  const [stillExecutingUserMetadata, setStillExecutingUserMetadata] =
    useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSettingInactive, setIsSettingInactive] = useState(false);
  const [userrawpost, setUserRawPost] = useState([]);
  const [articleUpdated, setArticleUpdated] = useState(0);
  function manipulateIsAunthenticated(status) {
    setIsAunthenticated(status);
  }

  function manipulateIsSettingInactive(status) {
    setIsSettingInactive(status);
  }

  function manipulateArticleUpdated(status) {
    setArticleUpdated(status);
  }

  function updateUserRawPost(posts) {
    setUserRawPost(posts);
  }

  function updateRArticles(articles) {
    setRArticles(articles);
  }

  function manipulateOfficerPosts(post) {
    setOfficerPosts((prevState) => {
      return [post, ...prevState];
    });
  }

  function manipulateActiveFilter(filter) {
    setActiveFilter(filter);
  }

  function incrementArticleUpdated() {
    setArticleUpdated((prevState) => prevState + 1);
  }

  function updateOfficerPosts(posts) {
    setOfficerPosts(posts);
  }

  function likeRArticle(article) {
    console.log("Article ", article);
    setRArticles((prevState) => {
      const existingOne = prevState.find((item) => item.id === article.id);
      console.log("Existing one ", existingOne);
      if (existingOne) {
        const copied = {
          ...existingOne,
          get_likes: {
            ...existingOne.get_likes,
            total: existingOne.get_likes.total + 1,
          },
        };

        console.log("COPIED ", copied);

        const index = prevState.indexOf(existingOne);
        prevState[index] = copied;
        return prevState;
      }
      return [article, ...prevState];
    });
  }

  function commentArticle(metadata, comment) {
    setRArticles((prevState) => {
      const existingOne = prevState.find((item) => item.id === metadata.id);
      if (existingOne) {
        const copied = {
          ...existingOne,
          get_comments: {
            ...existingOne.get_comments,
            total: existingOne.get_comments.total + 1,
            comments: [
              ...existingOne.get_comments.comments,
              {
                sender_id: usermetadata.get_user_id,
                comment,
              },
            ],
          },
        };

        const index = prevState.indexOf(existingOne);
        prevState[index] = copied;
        return prevState;
      }
      return [metadata, ...prevState];
    });
  }

  function unlikeRArticle(article) {
    console.log("Article ", article);
    setRArticles((prevState) => {
      const existingOne = prevState.find((item) => item.id === article.id);
      console.log("Existing one ", existingOne);
      if (existingOne) {
        const copied = {
          ...existingOne,
          get_likes: {
            ...existingOne.get_likes,
            total: existingOne.get_likes.total - 1,
          },
        };

        console.log("COPIED ", copied);

        const index = prevState.indexOf(existingOne);
        prevState[index] = copied;
        return prevState;
      }
      return [article, ...prevState];
    });
  }

  function manipulateRArticles(article) {
    setRArticles((prevState) => {
      const exisstingOne = prevState.find((item) => item.id === article.id);
      if (exisstingOne) {
        const index = prevState.indexOf(exisstingOne);
        prevState[index] = article;
        return prevState;
      }
      return [article, ...prevState];
    });
  }

  function manipulateUserRawPost(post) {
    setUserRawPost((prevState) => {
      const existingOne = prevState.find((item) => item.id === post.id);

      // replace the existing one with this new one
      if (existingOne) {
        const index = prevState.indexOf(existingOne);
        prevState[index] = post;
        return prevState;
      }
      // else just add it to the list
      return [post, ...prevState];
    });
  }

  useEffect(() => {
    if (usermetadata) {
      setStillExecutingUserMetadata(false);
    }
  }, [usermetadata]);

  // this is called before it should logout the user is it detect he's not registered
  async function executeUserMetadata() {
    let user_id = await AsyncStorage.getItem("user_id");
    let phone_number = await AsyncStorage.getItem("phone_number");
    setLastLoginPhoneNumber(phone_number);

    if (user_id) {
      setIsAunthenticated(true);
      fetch(`${BASE_URL}/api/userdetails/`, {
        method: "POST",
        body: JSON.stringify({
          user_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status !== 200) {
            if (response.status === 404) {
              throw new Error(`Unrecognized user group ${user_id}`);
            }
            response.json().then((data) => {
              throw new Error(data.details);
            });
          }
          return response.json();
        })
        .then(async (data) => {
          console.log("THIS ARE DATA ", data);
          setUserMetadata(data);

          if (data.usergroup.toLowerCase() === "researcher") {
            // fetch again the user raw post
            try {
              const response = await ResearcherArticles(data.get_user_id);
              console.log("These are user data...", response);
              updateUserRawPost(response);
            } catch (err) {
              console.log("THIS IS ERROR MESSAGE ", err.message);
            }
          }
        })
        .catch((err) => {
          if (
            err.message
              .toLowerCase()
              .includes("Unrecognized user".toLowerCase())
          ) {
            // delete that user... i don't care about the result...

            const splitted = err.message.split(" ");
            const user_id = splitted[splitted.length - 1];
            fetch(`${BASE_URL}/api/delete_user/`, {
              method: "POST",
              body: JSON.stringify({
                user_id,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then((data) => console.log("THIS IS RESOLVED RESPONSE ", data))
              .catch((err) =>
                console.log("THIS IS ERROR MESSAGE ", err.message)
              );
            console.log("I SHOULD LOGOUT THE USER");
            logout();
            setStillExecutingUserMetadata(false);
          } else {
            console.log("Whats happened ", err.message);
            // in most case we have "CustomUser matching query does not exist for that case i think we should logout. and delete stored userid"
            // THIS IS BECAUSE THE USER GROUP IS NOT RECOGNIZED.. SHOULD WE AVOID THAT USER? JUST DELETE EM OR WE SHOULD LEAVE IT
            logout();
            // no need to alert the user about what happend on the backgound just logout out.. and as you know we'll have the spinner until this request get
            // completed....
            setStillExecutingUserMetadata(false);
          }
        });
    } else {
      setStillExecutingUserMetadata(false);
      // also you
    }
  }

  // all required action required on startapp of app call em here
  useEffect(() => {
    executeUserMetadata();
  }, []);

  async function logout() {
    setIsAunthenticated(false);
    setUserMetadata({});
    setAlreadyValidated(false);
    await AsyncStorage.removeItem("user_id");
  }

  function manipulateToggleOnAbout(status) {
    setToggleOnAbout(status);
  }

  function manipulateLastLoginPhoneNumber(phone_number) {
    setLastLoginPhoneNumber(phone_number);
  }

  function manipulateAlreadyValidated(status) {
    setAlreadyValidated(status);
  }

  function addRegisterMetadata(metadata) {
    setRegisterMetadata((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  }

  function clearRegisterMetadata() {
    setRegisterMetadata({});
  }

  function manipulateUserMetadata(metadata) {
    setUserMetadata((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  }

  const value = {
    isAunthenticated,
    usermetadata,
    toggleOnAbout,
    registermetadata,
    alreadyValidated,
    lastLoginPhoneNumber,
    isSettingInactive,
    userrawpost,
    rArticles,
    officerposts,
    articleUpdated,
    activeFilter,
    logout,
    manipulateIsAunthenticated,
    manipulateUserMetadata,
    manipulateToggleOnAbout,
    addRegisterMetadata,
    clearRegisterMetadata,
    manipulateAlreadyValidated,
    manipulateLastLoginPhoneNumber,
    manipulateIsSettingInactive,
    updateUserRawPost,
    manipulateUserRawPost,
    manipulateRArticles,
    updateRArticles,
    manipulateOfficerPosts,
    updateOfficerPosts,
    manipulateArticleUpdated,
    incrementArticleUpdated,
    likeRArticle,
    unlikeRArticle,
    commentArticle,
    manipulateActiveFilter,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContextProvider;

import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants/domain";

export const getOTP = async (phone_number) => {
  console.log("Full url ", `${BASE_URL}/api/sendotp/`);
  // phone number ina-fika ila bado in some case ina-return "SyntaxError: JSON Parse error: Unexpected token: <"
  console.log("THIS IS PHONE NUMBER ", phone_number);
  return fetch(`${BASE_URL}/api/sendotp/`, {
    method: "POST",
    body: JSON.stringify({
      phone_number: phone_number,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      // I think the error from "Temporary failure in name resolution" is resolved by status
      // code of 200 this makes us difficult to trace it by looking on the nature of our code here
      console.log("This is status code ", response.status);
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then((output) => {
          console.log("OUTPUT ", output);
          throw new Error(output);
        });
      }
    })
    .then((data) => Promise.resolve({ data }))
    .catch((error) => {
      return Promise.reject({ error });
    });
};

export const validateOTP = async (phone_number, otp) => {
  return fetch(`${BASE_URL}/api/validateotp/`, {
    method: "POST",
    body: JSON.stringify({
      phone_number,
      otp,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then((output) => {
          throw new Error(output);
        });
      }
    })
    .then((data) => Promise.resolve({ data }))
    .catch((error) => Promise.reject({ error }));
};

export const executeUserMetadata = async (uid) => {
  let user_id = uid ? uid : await AsyncStorage.getItem("uid");
  return fetch(`${BASE_URL}/api/userdetails/`, {
    method: "POST",
    body: JSON.stringify({
      user_id: user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        if (res.status === 404) {
          throw new Error(`Unrecognized user group ${user_id}`);
        }
        res.json().then((data) => {
          console.log("THIS IS WHAT WE RESOLVE ", data.details);
          throw new Error(data.details);
        });
      }
      return res.json();
    })
    .then((resData) => {
      return Promise.resolve(resData);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const registerUser = async (phone_number, usergroup, pin, deviceID) => {
  return fetch(`${BASE_URL}/api/register/`, {
    method: "POST",
    body: JSON.stringify({
      phone_number,
      usergroup,
      pin,
      deviceID,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then((output) => {
          throw new Error(output);
        });
      }
    })
    .then((data) => Promise.resolve({ data }))
    .catch((error) => Promise.reject({ error }));
};

export const loginUser = async (phone, password) => {
  return fetch(`${BASE_URL}/api/login/`, {
    method: "POST",
    body: JSON.stringify({
      phone,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        if (response.status === 401) {
          throw new Error(`Unrecognized user group`);
        } else {
          response.json().then((output) => {
            throw new Error(output);
          });
        }
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => {
      console.log("Error occured ", error.message);
      return Promise.reject({ error });
    });
};

export const CompleteOfficerProfileHandler = async (fdata, headers) => {
  return fetch(`${BASE_URL}/api/completeofficerprofile/`, {
    method: "POST",
    body: fdata,
    headers: headers,
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 406) {
        throw new Error(`We don't accept user group`);
      } else {
        response.json().then((output) => {
          throw new Error(output.details);
        });
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject(error));
};

export const CompleteResearcherProfileHandler = async (fdata, headers) => {
  return fetch(`${BASE_URL}/api/completeresearcherprofile/`, {
    method: "POST",
    body: fdata,
    headers: headers,
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 406) {
        throw new Error(`We don't accept this usergroup`);
      } else {
        response.json().then((output) => {
          throw new Error(output.details);
        });
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject(error));
};

export const CreateArticleHandler = async (fdata, headers) => {
  console.log("someone call me ");
  return fetch(`${BASE_URL}/api/createarticle/`, {
    method: "POST",
    body: fdata,
    headers: headers,
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 406) {
        throw new Error(`We don't accept this usergroup`);
      } else {
        response.json().then((output) => {
          throw new Error(output.details);
        });
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject(error));
};

export const UpdateArticle = async (fdata, headers) => {
  console.log("someone call me ");
  return fetch(`${BASE_URL}/api/updatearticle/`, {
    method: "POST",
    body: fdata,
    headers: headers,
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 406) {
        throw new Error(`We don't accept this usergroup`);
      } else {
        response.json().then((output) => {
          throw new Error(output.details);
        });
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject(error));
};

export const DraftArticle = async (fdata, headers) => {
  console.log("someone call me ");
  return fetch(`${BASE_URL}/api/draftarticle/`, {
    method: "POST",
    body: fdata,
    headers: headers,
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 406) {
        throw new Error(`We don't accept this usergroup`);
      } else {
        response.json().then((output) => {
          throw new Error(output.details);
        });
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject(error));
};

export const ResearcherArticles = async (user_id) => {
  return fetch(`${BASE_URL}/api/rarticles/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        res.json().then((data) => {
          console.log("THIS IS WHAT WE RESOLVE ", data.details);
          throw new Error(data.details);
        });
      }
      return res.json();
    })
    .then((resData) => {
      return Promise.resolve(resData);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const ResearcherArticlesList = async () => {
  return fetch(`${BASE_URL}/api/rarticleslist/`)
    .then((res) => {
      if (res.status !== 200) {
        res.json().then((data) => {
          throw new Error(data.details);
        });
      }
      return res.json();
    })
    .then((resData) => {
      console.log("reData ", resData);
      return Promise.resolve(resData);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const OfficerPosts = async (user_id) => {
  return fetch(`${BASE_URL}/api/officerposts/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        res.json().then((data) => {
          throw new Error(data.details);
        });
      }
      return res.json();
    })
    .then((resData) => {
      return Promise.resolve(resData);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

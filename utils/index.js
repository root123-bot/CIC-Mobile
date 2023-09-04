export const computeUserGroup = (usergroup) => {
  console.log("This is received user group ", usergroup);
  if (usergroup.toLowerCase() === "NORMAL USER".toLowerCase()) {
    return "mkulima";
  } else if (usergroup.toLowerCase() === "RESEARCHER".toLowerCase()) {
    return "researcher";
  } else if (usergroup.toLowerCase() === "OFFICER".toLowerCase()) {
    return "officer";
  } else {
    return "mkulima";
  }
};

import { Asset } from "expo-asset";

export const _cacheResourcesAsync = async () => {
  const images = [
    // require("../assets/images/background/1.jpg"),
    require("../assets/images/background/2.jpg"),
    // require("../assets/images/background/3.jpg"),
    // require("../assets/images/background/4.jpg"),
    // require("../assets/images/background/5.jpg"),
    require("../assets/images/background/6.jpg"),
  ];

  const cacheImages = images.map((image) => {
    return Asset.fromModule(image).downloadAsync();
  });

  return Promise.all(cacheImages);
};

const readEnv = (key) => {
  if (typeof process !== "undefined" && process?.env?.[key]) {
    return process.env[key];
  }

  return undefined;
};

export const baseApiURL = () => {
  return (
    readEnv("REACT_APP_APILINK") ||
    "http://localhost:4000/api"
  );
};

export const baseMediaURL = () => {
  return (
    readEnv("REACT_APP_MEDIA_LINK") ||
    "http://localhost:4000/media"
  );
};


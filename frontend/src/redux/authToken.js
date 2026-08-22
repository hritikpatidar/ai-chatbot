let updateReduxToken = null;

export const setTokenUpdater = (callback) => {
  updateReduxToken = callback;
};

export const updateReduxAccessToken = (token) => {
  if (updateReduxToken && token) {
    updateReduxToken(token);
  }
};
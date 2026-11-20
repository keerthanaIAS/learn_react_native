import api from './api';

// Register Expo push token for logged-in user
export const registerPushToken = async (
  mobile: string,
  expoPushToken: string
) => {
  console.log('[registerPushToken] /register-token with:', { mobile, expoPushToken });
  const response = await api.post('/register-token', {
    mobile,
    expoPushToken,
  });
  console.log('[registerPushToken] response:', response.data);
  return response.data;
};

// Send push notification to all logged-in users
export const notifyAllUsers = async (
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  console.log('[notifyAllUsers] /notify-all with:', { title, body, data });
  const response = await api.post('/notify-all', {
    title,
    body,
    data,
  });
  console.log('[notifyAllUsers] response:', response.data);
  return response.data;
};

// Send push notification to a specific user by mobile number
export const notifyUserByMobile = async (
  mobile: string,
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  console.log(`[notifyUserByMobile] /notify-user/${mobile} with:`, { title, body, data });
  const response = await api.post(`/notify-user/${mobile}`, {
    title,
    body,
    data,
  });
  console.log('[notifyUserByMobile] response:', response.data);
  return response.data;
};
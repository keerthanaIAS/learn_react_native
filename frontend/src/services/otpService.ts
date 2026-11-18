
import api from './api';

// Generate OTP
export const generateOtp = async (mobile: string) => {
  console.log('[generateOtp] /send-otp with:', mobile);
  const response = await api.post('/send-otp', { mobile });
  console.log('[generateOtp] response:', response.data);
  return response.data;
};

// Verify OTP
export const verifyOtp = async (
  mobile: string,
  otp: string
) => {
  console.log('[verifyOtp] /verify-otp with:', { mobile, otp });
  const response = await api.post('/verify-otp', { mobile, otp });
  console.log('[verifyOtp] response:', response.data);
  return response.data;
};

// Resend OTP
export const resendOtp = async (mobile: string) => {
  console.log('[resendOtp] /resend-otp with:', { mobile });
  const response = await api.post('/resend-otp', { mobile });
  console.log('[resendOtp] response:', response.data);
  return response.data;
};

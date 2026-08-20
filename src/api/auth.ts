import { api, hasApiUrl } from "./client";

const SEND_PARTNER_OTP_PATH = "/api/v1/partner/auth/send-otp";
const VERIFY_PARTNER_OTP_PATH = "/api/v1/partner/auth/verify-otp";
const REGISTER_ACCOUNT_PATH = "/api/v1/auth/register";

export type SendPartnerOtpRequest = {
  countryCode: "+91";
  mobileNumber: string;
};

export type SendPartnerOtpResponse = {
  success: boolean;
  message: string;
  data: {
    verificationId: string;
    maskedMobile: string;
    expiresIn: number;
    resendAfter: number;
  };
};

export type VerifyPartnerOtpRequest = {
  verificationId: string;
  mobileNumber: string;
  otp: string;
};

export type VerifyPartnerOtpResponse = {
  success: boolean;
  message: string;
  data: {
    isNewPartner: boolean;
    verificationStatus: "VERIFIED";
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    partner: {
      partnerId: string;
      name: string;
      mobileNumber: string;
      status: "ACTIVE";
    };
  };
};

export type RegisterAccountRequest = {
  verificationId: string;
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  termsAccepted: boolean;
};

export type RegisterAccountResponse = {
  success: boolean;
  message: string;
  data: {
    userId: string;
    name: string;
    email: string;
    mobileNumber: string;
    accessToken: string;
    refreshToken: string;
  };
};

/**
 * Calls POST /api/v1/partner/auth/send-otp when EXPO_PUBLIC_API_URL is set.
 * Uses local mock data until a server URL is configured.
 */
export async function sendPartnerOtp(
  payload: SendPartnerOtpRequest,
): Promise<SendPartnerOtpResponse> {
  if (hasApiUrl) {
    return api.post<SendPartnerOtpResponse, SendPartnerOtpRequest>(
      SEND_PARTNER_OTP_PATH,
      payload,
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    message: "OTP sent successfully",
    data: {
      verificationId: "PVER1001",
      maskedMobile: `******${payload.mobileNumber.slice(-4)}`,
      expiresIn: 120,
      resendAfter: 30,
    },
  };
}

/**
 * Calls POST /api/v1/partner/auth/verify-otp when EXPO_PUBLIC_API_URL is set.
 * Uses local mock data until a server URL is configured.
 */
export async function verifyPartnerOtp(
  payload: VerifyPartnerOtpRequest,
): Promise<VerifyPartnerOtpResponse> {
  if (hasApiUrl) {
    return api.post<VerifyPartnerOtpResponse, VerifyPartnerOtpRequest>(
      VERIFY_PARTNER_OTP_PATH,
      payload,
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    message: "OTP verified successfully",
    data: {
      isNewPartner: true,
      verificationStatus: "VERIFIED",
      accessToken: "ACCESS_TOKEN",
      refreshToken: "REFRESH_TOKEN",
      expiresIn: 3600,
      partner: {
        partnerId: "PART1001",
        name: "Kannan P",
        mobileNumber: `+91${payload.mobileNumber}`,
        status: "ACTIVE",
      },
    },
  };
}

/**
 * Calls POST /api/v1/auth/register when EXPO_PUBLIC_API_URL is set.
 * Uses local mock data until a server URL is configured.
 */
export async function registerAccount(
  payload: RegisterAccountRequest,
): Promise<RegisterAccountResponse> {
  if (hasApiUrl) {
    return api.post<RegisterAccountResponse, RegisterAccountRequest>(
      REGISTER_ACCOUNT_PATH,
      payload,
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    message: "Account created successfully ",
    data: {
      userId: "USR1001",
      name: payload.name,
      email: payload.email,
      mobileNumber: `+91${payload.mobileNumber}`,
      accessToken: "ACCESS_TOKEN",
      refreshToken: "REFRESH_TOKEN",
    },
  };
}

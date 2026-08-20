import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { getApiError } from "@/api/client";
import { sendPartnerOtp } from "@/api/auth";
import { GoogleIcon } from "@/assets/svg";
import { Fonts } from "@/constants/theme";

type LoginScreenProps = {
  onSignUp?: () => void;
  onOtpSent?: (details: {
    mobileNumber: string;
    verificationId: string;
  }) => void;
};

export function LoginScreen({ onOtpSent, onSignUp }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  const getMobileNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.startsWith("91") && digits.length === 12
      ? digits.slice(2)
      : digits;
  };

  const getPhoneError = (mobileNumber: string) => {
    if (mobileNumber.length < 10) {
      return "Mobile number must contain 10 digits.";
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      return "Enter a valid 10-digit mobile number.";
    }

    return null;
  };

  const hasMobileNumber = getMobileNumber(phoneNumber).length > 0;

  const handleSendOtp = async () => {
    const mobileNumber = getMobileNumber(phoneNumber);
    const validationError = getPhoneError(mobileNumber);

    if (validationError) {
      setPhoneError(validationError);
      setMessage(null);
      return;
    }

    setIsSendingOtp(true);
    setPhoneError(null);
    setIsError(false);
    setMessage(null);

    try {
      const response = await sendPartnerOtp({
        countryCode: "+91",
        mobileNumber,
      });

      if (!response.success) {
        setIsError(true);
        setMessage(response.message);
        return;
      }

      setMessage(
        response.data?.maskedMobile
          ? `OTP sent to ${response.data.maskedMobile}`
          : response.message,
      );
      onOtpSent?.({
        mobileNumber,
        verificationId: response.data.verificationId,
      });
    } catch (error) {
      setIsError(true);
      setMessage(getApiError(error).message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={24}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
    >
      <View className="flex-1 justify-between bg-white px-10 pb-10 pt-20">
        <View className="items-center">
          <Text
            className="text-[32px] tracking-[1px] text-[#3D14B8]"
            style={{ fontFamily: Fonts.bold }}
          >
            VAYZO
          </Text>
          <Text
            className="mt-6 text-[18px] text-[#15122D]"
            style={{ fontFamily: Fonts.semibold }}
          >
            Login to continue
          </Text>
        </View>

        <View>
          <Text
            className="mb-2 text-sm text-[#6D6A7A]"
            style={{ fontFamily: Fonts.regular }}
          >
            Mobile Number
          </Text>
          <TextInput
            accessibilityLabel="Mobile number"
            accessibilityHint={phoneError ?? "Enter a 10-digit mobile number"}
            className={`h-14 rounded-[6px] border-[0.5px] px-5 py-0 text-[18px] text-[#22203B] ${phoneError ? "border-[#D5222A]" : isPhoneFocused ? "border-[#3D14B8]" : "border-[#B8A7EE]"}`}
            keyboardType="phone-pad"
            maxLength={13}
            onChangeText={(value) => {
              setPhoneNumber(value);
              setMessage(null);

              if (phoneError) {
                setPhoneError(getPhoneError(getMobileNumber(value)));
              }
            }}
            onBlur={() => setIsPhoneFocused(false)}
            onFocus={() => setIsPhoneFocused(true)}
            placeholder="+91 98765 43210"
            placeholderTextColor="#9B98A7"
            style={{ fontFamily: Fonts.regular, textAlignVertical: "center" }}
            value={phoneNumber}
          />
          {phoneError ? (
            <Text
              className="mt-2 text-sm text-[#D5222A]"
              style={{ fontFamily: Fonts.regular }}
            >
              {phoneError}
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            className={`${phoneError ? "mt-4" : "mt-6"} h-16 items-center justify-center rounded-2xl ${hasMobileNumber && !isSendingOtp ? "bg-[#3D14B8]" : "bg-[#B4B4B4]"}`}
            disabled={!hasMobileNumber || isSendingOtp}
            onPress={handleSendOtp}
          >
            <Text
              className="text-[16px] text-white"
              style={{ fontFamily: Fonts.semibold }}
            >
              {isSendingOtp ? "Sending OTP..." : "Continue"}
            </Text>
          </Pressable>
          {message ? (
            <Text
              className={`mt-3 text-center text-sm ${isError ? "text-[#D5222A]" : "text-[#18713E]"}`}
              style={{ fontFamily: Fonts.regular }}
            >
              {message}
            </Text>
          ) : null}
        </View>

        <View className="items-center">
          <Text className="text-sm text-[#6D6A7A]" style={{ fontFamily: Fonts.regular }}>
            Don’t have any account?{" "}
            <Text className="text-[#3D14B8]" onPress={onSignUp}>
              Sign up
            </Text>
          </Text>
          <Text
            className="mt-9 text-[18px] tracking-[1px] text-[#15122D]"
            style={{ fontFamily: Fonts.semibold }}
          >
            or continue with
          </Text>
          <View className="mt-6 items-center">
            <Pressable
              accessibilityLabel="Continue with Google"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center"
            >
              <GoogleIcon height={30} width={30} />
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

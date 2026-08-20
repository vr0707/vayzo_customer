import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { verifyPartnerOtp } from "@/api/auth";
import { getApiError } from "@/api/client";
import { Fonts } from "@/constants/theme";

type OtpVerificationScreenProps = {
  mobileNumber: string;
  verificationId: string;
  onChangeNumber: () => void;
  onNewPartner: (details: {
    mobileNumber: string;
    verificationId: string;
  }) => void;
};

const OTP_LENGTH = 4;

function formatMobileNumber(mobileNumber: string) {
  return `+91 ${mobileNumber.slice(0, 5)} ${mobileNumber.slice(5)}`;
}

export function OtpVerificationScreen({
  mobileNumber,
  verificationId,
  onChangeNumber,
  onNewPartner,
}: OtpVerificationScreenProps) {
  const [otp, setOtp] = useState(Array<string>(OTP_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [resendRemaining, setResendRemaining] = useState(25);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    null,
  );
  const [isVerificationError, setIsVerificationError] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const isOtpComplete = otp.every(Boolean);

  useEffect(() => {
    if (resendRemaining === 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendRemaining((current) => Math.max(current - 1, 0));
    }, 1_000);

    return () => clearInterval(timer);
  }, [resendRemaining]);

  const updateOtp = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const deletedDigit = !digit && Boolean(otp[index]);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (deletedDigit && index > 0) {
      requestAnimationFrame(() => inputRefs.current[index - 1]?.focus());
      return;
    }

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setOtp(Array<string>(OTP_LENGTH).fill(""));
    setResendRemaining(25);
    setFocusedIndex(0);
    inputRefs.current[0]?.focus();
  };

  const handleVerifyOtp = async () => {
    if (!isOtpComplete) {
      return;
    }

    setIsVerifying(true);
    setVerificationMessage(null);
    setIsVerificationError(false);

    try {
      const response = await verifyPartnerOtp({
        verificationId,
        mobileNumber,
        otp: otp.join(""),
      });

      if (!response.success) {
        setIsVerificationError(true);
      }

      setVerificationMessage(response.message);

      if (response.success && response.data.isNewPartner) {
        onNewPartner({ mobileNumber, verificationId });
      }
    } catch (error) {
      setIsVerificationError(true);
      setVerificationMessage(getApiError(error).message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={24}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
    >
      <View className="flex-1 bg-white px-10 pt-16">
        <View className="items-center">
          <Text
            className="text-[27px] tracking-[1px] text-[#3D14B8]"
            style={{ fontFamily: Fonts.bold }}
          >
            VAYZO
          </Text>
          <Text
            className="text-[10px] text-[#15122D]"
            style={{ fontFamily: Fonts.medium }}
          >
            You Ask. We Get It.
          </Text>
        </View>

        <View className="mt-11">
          <Text
            className="text-[21px] text-[#15122D]"
            style={{ fontFamily: Fonts.semibold }}
          >
            Enter OTP
          </Text>
          <Text
            className="mt-7 text-sm text-[#6D6A7A]"
            style={{ fontFamily: Fonts.regular }}
          >
            Enter OTP sent to {formatMobileNumber(mobileNumber)}
          </Text>
          <Pressable
            accessibilityRole="button"
            className="mt-3 self-start"
            onPress={onChangeNumber}
          >
            <Text
              className="text-[11px] text-[#3D14B8]"
              style={{ fontFamily: Fonts.semibold }}
            >
              CHANGE NUMBER
            </Text>
          </Pressable>

          <View className="mt-8 flex-row justify-between">
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(input) => {
                  inputRefs.current[index] = input;
                }}
                accessibilityLabel={`OTP digit ${index + 1}`}
                className={`h-16 w-14 rounded-lg border-2 text-center text-xl text-[#15122D] ${focusedIndex === index ? "border-[#FF4829]" : "border-[#D8D6E2]"}`}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(input) => updateOtp(input, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace" && !value && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                selectTextOnFocus
                style={{ fontFamily: Fonts.medium }}
                value={value}
              />
            ))}
          </View>

          {resendRemaining > 0 ? (
            <Text
              className="mt-5 text-sm text-[#6D6A7A]"
              style={{ fontFamily: Fonts.regular }}
            >
              Resend OTP in 00:{String(resendRemaining).padStart(2, "0")}
            </Text>
          ) : (
            <Pressable
              accessibilityRole="button"
              className="mt-5 self-start"
              onPress={handleResendOtp}
            >
              <Text
                className="text-sm text-[#3D14B8]"
                style={{ fontFamily: Fonts.semibold }}
              >
                Resend OTP
              </Text>
            </Pressable>
          )}

          <Pressable
            accessibilityRole="button"
            className={`mt-10 h-14 items-center justify-center rounded-xl ${isOtpComplete && !isVerifying ? "bg-[#3D14B8]" : "bg-[#B4B4B4]"}`}
            disabled={!isOtpComplete || isVerifying}
            onPress={handleVerifyOtp}
          >
            <Text
              className="text-[16px] text-white"
              style={{ fontFamily: Fonts.semibold }}
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Text>
          </Pressable>
          {verificationMessage ? (
            <Text
              className={`mt-3 text-center text-sm ${isVerificationError ? "text-[#D5222A]" : "text-[#18713E]"}`}
              style={{ fontFamily: Fonts.regular }}
            >
              {verificationMessage}
            </Text>
          ) : null}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

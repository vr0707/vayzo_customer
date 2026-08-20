import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { registerAccount } from "@/api/auth";
import { getApiError } from "@/api/client";
import { Fonts } from "@/constants/theme";

type RegistrationScreenProps = {
  mobileNumber: string;
  verificationId: string;
};

type EditableField =
  | "name"
  | "email"
  | "phoneNumber"
  | "password"
  | "confirmPassword";
type ValidationErrors = Partial<Record<EditableField | "terms", string>>;

function formatMobileNumber(mobileNumber: string) {
  if (!mobileNumber) {
    return "";
  }

  return `+91 ${mobileNumber.slice(0, 5)} ${mobileNumber.slice(5)}`;
}

export function RegistrationScreen({
  mobileNumber,
  verificationId,
}: RegistrationScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(mobileNumber);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [focusedField, setFocusedField] = useState<EditableField | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const isPhoneNumberEditable = !verificationId;

  const hasStartedRegistration = Boolean(
    name.trim() || email.trim() || phoneNumber || password || confirmPassword,
  );

  const validateForm = () => {
    const errors: ValidationErrors = {};

    if (!name.trim()) {
      errors.name = "Full name is required.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      errors.phoneNumber = "Enter a valid 10-digit phone number.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!termsAccepted) {
      errors.terms = "Please accept the Terms & Conditions.";
    }

    return errors;
  };

  const handleRegister = async () => {
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setMessage(null);
      return;
    }

    setIsRegistering(true);
    setMessage(null);
    setIsError(false);

    try {
      const response = await registerAccount({
        verificationId,
        name: name.trim(),
        email: email.trim(),
        mobileNumber: phoneNumber,
        password,
        termsAccepted,
      });

      setIsError(!response.success);
      setMessage(response.message);
    } catch (error) {
      setIsError(true);
      setMessage(getApiError(error).message);
    } finally {
      setIsRegistering(false);
    }
  };

  const inputClassName = (field: EditableField) =>
    `mt-1 h-14 rounded-[6px] border-[0.5px] px-5 py-0 text-[19px] text-[#15122D] ${validationErrors[field] ? "border-[#D5222A]" : focusedField === field ? "border-[#3D14B8]" : "border-black"}`;

  const clearFieldError = (field: EditableField) => {
    setValidationErrors((errors) => ({ ...errors, [field]: undefined }));
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={24}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
    >
      <View className="flex-1 justify-between bg-white px-10 pb-10 pt-16">
        <Text
          className="text-center text-[30px] text-[#15122D]"
          style={{ fontFamily: Fonts.semibold }}
        >
          Create Account
        </Text>

        <View className="mt-7">
          <Text
            className="text-base text-[#6D6A7A]"
            style={{ fontFamily: Fonts.regular, textAlignVertical: "center" }}
          >
            Full Name
          </Text>
          <TextInput
            accessibilityLabel="Full name"
            className={inputClassName("name")}
            onBlur={() => setFocusedField(null)}
            onChangeText={(value) => {
              setName(value);
              clearFieldError("name");
            }}
            onFocus={() => setFocusedField("name")}
            placeholder="Enter your full name"
            placeholderTextColor="#9B98A7"
            style={{ fontFamily: Fonts.regular, textAlignVertical: "center" }}
            value={name}
          />
          {validationErrors.name ? (
            <Text className="mt-1 text-xs text-[#D5222A]" style={{ fontFamily: Fonts.regular }}>
              {validationErrors.name}
            </Text>
          ) : null}
        </View>

        <View className="mt-5">
          <Text
            className="text-base text-[#6D6A7A]"
            style={{ fontFamily: Fonts.regular }}
          >
            Email
          </Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            className={inputClassName("email")}
            keyboardType="email-address"
            onBlur={() => setFocusedField(null)}
            onChangeText={(value) => {
              setEmail(value);
              clearFieldError("email");
            }}
            onFocus={() => setFocusedField("email")}
            placeholder="example@gmail.com"
            placeholderTextColor="#9B98A7"
            style={{ fontFamily: Fonts.regular, textAlignVertical: "center" }}
            value={email}
          />
          {validationErrors.email ? (
            <Text className="mt-1 text-xs text-[#D5222A]" style={{ fontFamily: Fonts.regular }}>
              {validationErrors.email}
            </Text>
          ) : null}
        </View>

        <View className="mt-5">
          <Text
            className="text-base text-[#6D6A7A]"
            style={{ fontFamily: Fonts.regular }}
          >
            Phone Number
          </Text>
          <TextInput
            accessibilityLabel="Phone number"
            className={`mt-1 h-14 rounded-[6px] border-[0.5px] px-5 py-0 text-[19px] ${isPhoneNumberEditable ? "text-[#15122D]" : "text-[#9B98A7]"} ${validationErrors.phoneNumber ? "border-[#D5222A]" : focusedField === "phoneNumber" ? "border-[#3D14B8]" : "border-[#B8B6C1]"}`}
            editable={isPhoneNumberEditable}
            keyboardType="phone-pad"
            maxLength={10}
            onBlur={() => setFocusedField(null)}
            onChangeText={(value) => {
              setPhoneNumber(value.replace(/\D/g, "").slice(0, 10));
              clearFieldError("phoneNumber");
            }}
            onFocus={() => setFocusedField("phoneNumber")}
            placeholder="+91 98765 43210"
            placeholderTextColor="#9B98A7"
            style={{ fontFamily: Fonts.regular, textAlignVertical: "center" }}
            value={
              isPhoneNumberEditable
                ? phoneNumber
                : formatMobileNumber(phoneNumber)
            }
          />
          {validationErrors.phoneNumber ? (
            <Text className="mt-1 text-xs text-[#D5222A]" style={{ fontFamily: Fonts.regular }}>
              {validationErrors.phoneNumber}
            </Text>
          ) : null}
        </View>

        <View className="mt-5">
          <Text
            className="text-base text-[#6D6A7A]"
            style={{ fontFamily: Fonts.regular, textAlignVertical: "center" }}
          >
            Password
          </Text>
          <TextInput
            accessibilityLabel="Password"
            className={inputClassName("password")}
            onBlur={() => setFocusedField(null)}
            onChangeText={(value) => {
              setPassword(value);
              clearFieldError("password");
            }}
            onFocus={() => setFocusedField("password")}
            placeholder="•••• •••• ••••"
            placeholderTextColor="#9B98A7"
            secureTextEntry
            style={{ fontFamily: Fonts.regular, textAlignVertical: "center" }}
            value={password}
          />
          {validationErrors.password ? (
            <Text className="mt-1 text-xs text-[#D5222A]" style={{ fontFamily: Fonts.regular }}>
              {validationErrors.password}
            </Text>
          ) : null}
        </View>

        <View className="mt-5">
          <Text className="text-base text-[#6D6A7A]" style={{ fontFamily: Fonts.regular }}>
            Confirm Password
          </Text>
          <TextInput
            accessibilityLabel="Confirm password"
            className={inputClassName("confirmPassword")}
            onBlur={() => setFocusedField(null)}
            onChangeText={(value) => {
              setConfirmPassword(value);
              clearFieldError("confirmPassword");
            }}
            onFocus={() => setFocusedField("confirmPassword")}
            placeholder="Re-enter your password"
            placeholderTextColor="#9B98A7"
            secureTextEntry
            style={{ fontFamily: Fonts.regular, textAlignVertical: "center" }}
            value={confirmPassword}
          />
          {validationErrors.confirmPassword ? (
            <Text className="mt-1 text-xs text-[#D5222A]" style={{ fontFamily: Fonts.regular }}>
              {validationErrors.confirmPassword}
            </Text>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: termsAccepted }}
          className="mt-7 flex-row items-center self-start"
          onPress={() => {
            setTermsAccepted((accepted) => !accepted);
            setValidationErrors((errors) => ({ ...errors, terms: undefined }));
          }}
        >
          <View
            className={`h-[18px] w-[18px] items-center justify-center rounded-[4px] ${termsAccepted ? "bg-[#6D6A7A]" : "border border-[#6D6A7A]"}`}
          >
            {termsAccepted ? (
              <Text className="text-xs text-white">✓</Text>
            ) : null}
          </View>
          <Text
            className="ml-3 text-base text-[#15122D]"
            style={{ fontFamily: Fonts.regular }}
          >
            I agree to Terms & Conditions
          </Text>
        </Pressable>
        {validationErrors.terms ? (
          <Text className="mt-1 text-xs text-[#D5222A]" style={{ fontFamily: Fonts.regular }}>
            {validationErrors.terms}
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          className={`mt-12 h-16 items-center justify-center rounded-2xl ${hasStartedRegistration && !isRegistering ? "bg-[#3D14B8]" : "bg-[#B4B4B4]"}`}
          disabled={!hasStartedRegistration || isRegistering}
          onPress={handleRegister}
        >
          <Text
            className="text-[16px] text-white"
            style={{ fontFamily: Fonts.semibold }}
          >
            {isRegistering ? "Creating..." : "Register"}
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
    </KeyboardAwareScrollView>
  );
}

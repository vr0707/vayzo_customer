import { useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  OnboardingScreen,
  type OnboardingSlide,
} from "@/screens/onboarding-screen";
import { LoginScreen } from "@/screens/login-screen";
import { OtpVerificationScreen } from "@/screens/otp-verification-screen";
import { RegistrationScreen } from "@/screens/registration-screen";

const slides: OnboardingSlide[] = [
  {
    title: "Food Delivery",
    description:
      "Order from your favourite restaurants and get it delivered hot & fresh.",
    color: "#D5222A",
    kind: "food",
    buttonLabel: "Next",
  },
  {
    title: "Buy & Get It",
    description:
      "Tell us what you need from any shop. We'll buy and get it for you.",
    color: "#161A80",
    kind: "shopping",
    buttonLabel: "Next",
  },
  {
    title: "Rides & Travel",
    description: "Book bikes or cars for local rides or outstation trips.",
    color: "#18713E",
    kind: "ride",
    buttonLabel: "Submit",
  },
];

export default function HomeScreen() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [otpDetails, setOtpDetails] = useState<{
    mobileNumber: string;
    verificationId: string;
  } | null>(null);
  const [registrationDetails, setRegistrationDetails] = useState<{
    mobileNumber: string;
    verificationId: string;
  } | null>(null);
  const slide = slides[slideIndex];

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        {registrationDetails ? (
          <RegistrationScreen
            mobileNumber={registrationDetails.mobileNumber}
            verificationId={registrationDetails.verificationId}
          />
        ) : otpDetails ? (
          <OtpVerificationScreen
            mobileNumber={otpDetails.mobileNumber}
            verificationId={otpDetails.verificationId}
            onChangeNumber={() => setOtpDetails(null)}
            onNewPartner={setRegistrationDetails}
          />
        ) : showLogin ? (
          <LoginScreen
            onOtpSent={setOtpDetails}
            onSignUp={() =>
              setRegistrationDetails({ mobileNumber: "", verificationId: "" })
            }
          />
        ) : (
          <OnboardingScreen
            index={slideIndex}
            onNext={() => {
              if (slide.buttonLabel === "Submit") {
                setShowLogin(true);
                return;
              }

              setSlideIndex((current) =>
                Math.min(current + 1, slides.length - 1),
              );
            }}
            slide={slide}
            totalSlides={slides.length}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F2FB" },
  content: { flex: 1, width: "100%", maxWidth: 460, alignSelf: "center" },
});

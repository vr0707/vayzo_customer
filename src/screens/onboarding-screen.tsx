import { useMemo } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import { OnboardingPagination } from '@/screens/onboarding-pagination';

export type OnboardingSlide = {
  title: string;
  description: string;
  color: string;
  kind: 'food' | 'shopping' | 'ride';
  buttonLabel: 'Next' | 'Submit';
};

type Props = { slide: OnboardingSlide; index: number; totalSlides: number; onNext: () => void };

export function OnboardingScreen({ slide, index, totalSlides, onNext }: Props) {
  const isSubmitButton = slide.buttonLabel === 'Submit';
  const panResponder = useMemo(
    () => PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 18,
      onPanResponderRelease: (_, gesture) => { if (gesture.dx < -50) onNext(); },
    }),
    [onNext],
  );

  return <View {...panResponder.panHandlers} className="relative flex-1 bg-white px-7 pb-44 pt-12">
    <View className="items-center">
      <Text className="mb-3.5 text-center text-[28px] leading-[34px]" style={[styles.heading, { color: slide.color }]}>
        {slide.title}
      </Text>
      <Text className="max-w-[290px] text-center text-[17px] leading-[27px] text-[#1D1D27]" style={styles.description}>
        {slide.description}
      </Text>
    </View>
    <View className="flex-1 items-center justify-center overflow-hidden"><OnboardingIllustration kind={slide.kind} /></View>
    <Pressable
      accessibilityLabel={isSubmitButton ? 'Submit onboarding' : 'Next onboarding step'}
      accessibilityRole="button"
      className="absolute bottom-10 left-7 right-7 h-[58px] items-center justify-center rounded-xl bg-[#4920D3]"
      onPress={onNext}
      style={({ pressed }) => pressed && styles.pressed}>
      <Text className="text-[19px] text-white" style={styles.buttonText}>{slide.buttonLabel}</Text>
    </Pressable>
    <View className="absolute bottom-6 left-7 right-7 items-center">
      <OnboardingPagination activeIndex={index} total={totalSlides} />
    </View>
  </View>;
}

function OnboardingIllustration({ kind }: Pick<OnboardingSlide, 'kind'>) {
  return <View style={styles.artboard}>
    {kind === 'food' && <Food />}
    {kind === 'shopping' && <Shopping />}
    {kind === 'ride' && <Ride />}
  </View>;
}

function Food() {
  return <>
    <View style={styles.pin}><View style={styles.pinDot} /></View>
    <View style={styles.drink}><View style={styles.drinkLid} /><View style={styles.straw} /></View>
    <View style={styles.fries}><View style={styles.friesSticks} /></View>
    <View style={styles.burger}><View style={styles.bunTop} /><View style={styles.lettuce} /><View style={styles.cheese} /><View style={styles.patty} /><View style={styles.bunBottom} /></View>
    <View style={styles.takeaway}><View style={styles.takeawayLid} /></View>
  </>;
}

function Shopping() {
  return <>
    <View style={styles.sparkOne} /><View style={styles.sparkTwo} />
    <View style={styles.bagHandle} /><View style={styles.bag}><View style={styles.bagStripe} /></View>
    <View style={styles.backCrate}><View style={styles.cucumber} /><View style={styles.carrot} /></View>
    <View style={styles.frontCrate}><View style={styles.tomato} /><View style={styles.orange} /><View style={styles.banana} /></View>
    <View style={styles.smallBag} />
  </>;
}

function Ride() {
  return <>
    <View style={styles.car}><View style={styles.carRoof} /><View style={styles.carWindow} /><View style={styles.carGrill} /></View>
    <View style={styles.scooterBody} /><View style={styles.scooterSeat} /><View style={styles.handlebar} />
    <View style={[styles.wheel, styles.rearWheel]} /><View style={[styles.wheel, styles.frontWheel]} />
    <View style={styles.riderHead}><View style={styles.helmet} /></View><View style={styles.riderBody} /><View style={styles.backpack} /><View style={styles.riderLeg} />
  </>;
}

const styles = StyleSheet.create({
  heading: { fontFamily: Fonts.bold },
  description: { fontFamily: Fonts.regular },
  artboard: { height: 300, position: 'relative', width: 310 },
  buttonText: { fontFamily: Fonts.bold }, pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  pin: { alignItems: 'center', backgroundColor: '#CB3A26', borderRadius: 24, height: 48, left: 138, paddingTop: 12, position: 'absolute', top: 22, transform: [{ rotate: '8deg' }], width: 42 }, pinDot: { backgroundColor: '#FFF4EC', borderRadius: 9, height: 18, width: 18 },
  drink: { backgroundColor: '#A82616', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, height: 94, left: 24, position: 'absolute', top: 127, transform: [{ skewX: '-5deg' }], width: 62 }, drinkLid: { backgroundColor: '#F8B346', borderRadius: 20, height: 14, left: -2, position: 'absolute', top: -7, width: 67 }, straw: { backgroundColor: '#F6DBBD', height: 54, left: 43, position: 'absolute', top: -48, transform: [{ rotate: '12deg' }], width: 5 },
  fries: { backgroundColor: '#DB302B', borderBottomLeftRadius: 14, borderBottomRightRadius: 14, height: 78, position: 'absolute', right: 23, top: 147, width: 82 }, friesSticks: { backgroundColor: '#F5A51F', borderRadius: 12, height: 72, left: 12, position: 'absolute', top: -45, width: 58 },
  burger: { alignItems: 'center', bottom: 13, height: 130, left: 51, position: 'absolute', width: 164 }, bunTop: { backgroundColor: '#E9A54A', borderTopLeftRadius: 78, borderTopRightRadius: 78, height: 55, width: 156 }, lettuce: { backgroundColor: '#4D9B38', borderRadius: 15, height: 13, marginTop: -3, width: 165 }, cheese: { backgroundColor: '#F5C73F', height: 17, transform: [{ rotate: '-3deg' }], width: 142 }, patty: { backgroundColor: '#65301E', borderRadius: 17, height: 24, marginTop: -4, width: 150 }, bunBottom: { backgroundColor: '#D98838', borderBottomLeftRadius: 45, borderBottomRightRadius: 45, height: 25, marginTop: -3, width: 156 }, takeaway: { backgroundColor: '#A85820', borderRadius: 6, bottom: 6, height: 38, left: 198, position: 'absolute', width: 48 }, takeawayLid: { backgroundColor: '#F2BB78', borderRadius: 4, height: 9, position: 'absolute', top: -5, width: 48 },
  bagHandle: { borderColor: '#5423AF', borderRadius: 50, borderWidth: 15, height: 104, left: 103, position: 'absolute', top: 31, width: 88 }, bag: { backgroundColor: '#5C22B5', borderRadius: 9, height: 130, left: 79, overflow: 'hidden', position: 'absolute', top: 103, width: 138 }, bagStripe: { backgroundColor: '#7D43D1', height: 130, left: 18, width: 13 },
  backCrate: { backgroundColor: '#6C37B6', borderRadius: 8, bottom: 20, height: 105, position: 'absolute', right: 18, width: 128 }, frontCrate: { backgroundColor: '#A73987', borderRadius: 7, bottom: 7, height: 90, left: 36, position: 'absolute', width: 120 }, smallBag: { backgroundColor: '#EB5C4C', borderRadius: 5, bottom: 0, height: 65, left: 131, position: 'absolute', width: 48 }, carrot: { backgroundColor: '#ED7B26', borderRadius: 14, height: 66, left: 78, position: 'absolute', top: -28, transform: [{ rotate: '36deg' }], width: 18 }, cucumber: { backgroundColor: '#3C9A3B', borderRadius: 14, height: 76, left: 21, position: 'absolute', top: -34, transform: [{ rotate: '18deg' }], width: 20 }, tomato: { backgroundColor: '#E94D32', borderRadius: 22, height: 43, left: 15, position: 'absolute', top: -22, width: 43 }, orange: { backgroundColor: '#F9A62A', borderRadius: 18, height: 36, left: 69, position: 'absolute', top: -18, width: 36 }, banana: { backgroundColor: '#F6C92D', borderRadius: 16, height: 26, position: 'absolute', right: 10, top: -12, transform: [{ rotate: '-26deg' }], width: 58 }, sparkOne: { backgroundColor: '#F5A12A', borderRadius: 4, height: 10, left: 76, position: 'absolute', top: 52, transform: [{ rotate: '45deg' }], width: 10 }, sparkTwo: { backgroundColor: '#F59B20', borderRadius: 4, height: 12, position: 'absolute', right: 51, top: 53, transform: [{ rotate: '45deg' }], width: 12 },
  car: { backgroundColor: '#E9EDF2', borderRadius: 30, bottom: 79, height: 91, left: 4, position: 'absolute', width: 190 }, carRoof: { backgroundColor: '#364151', borderTopLeftRadius: 45, borderTopRightRadius: 45, height: 42, left: 37, position: 'absolute', top: -28, width: 113 }, carWindow: { backgroundColor: '#1E2938', borderRadius: 10, height: 27, left: 48, position: 'absolute', top: -18, width: 93 }, carGrill: { backgroundColor: '#222B38', borderRadius: 6, bottom: 16, height: 16, left: 20, position: 'absolute', width: 55 }, scooterBody: { backgroundColor: '#187ADE', borderRadius: 37, bottom: 43, height: 76, position: 'absolute', right: 18, width: 133 }, scooterSeat: { backgroundColor: '#202637', borderRadius: 12, bottom: 108, height: 19, position: 'absolute', right: 96, transform: [{ rotate: '8deg' }], width: 68 }, handlebar: { backgroundColor: '#263342', height: 53, position: 'absolute', right: 37, top: 134, transform: [{ rotate: '25deg' }], width: 7 }, wheel: { backgroundColor: '#1F2733', borderColor: '#AEB8C5', borderRadius: 29, borderWidth: 7, bottom: 10, height: 58, position: 'absolute', width: 58 }, rearWheel: { right: 116 }, frontWheel: { right: 9 }, riderHead: { backgroundColor: '#9B5B39', borderRadius: 21, height: 43, position: 'absolute', right: 84, top: 64, width: 42 }, helmet: { backgroundColor: '#1E2634', borderTopLeftRadius: 22, borderTopRightRadius: 22, height: 28, left: -2, position: 'absolute', top: -9, width: 47 }, riderBody: { backgroundColor: '#DC4E25', borderRadius: 28, height: 99, position: 'absolute', right: 54, top: 99, transform: [{ rotate: '-18deg' }], width: 64 }, backpack: { backgroundColor: '#E55A2B', borderRadius: 15, height: 65, position: 'absolute', right: 25, top: 107, width: 42 }, riderLeg: { backgroundColor: '#222B38', borderRadius: 15, height: 105, position: 'absolute', right: 77, top: 163, transform: [{ rotate: '22deg' }], width: 24 },
});

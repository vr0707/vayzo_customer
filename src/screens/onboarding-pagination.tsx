import { View } from 'react-native';

export function OnboardingPagination({
  activeIndex,
  total,
}: {
  activeIndex: number;
  total: number;
}) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          className={index === activeIndex ? 'h-1.5 w-2.5 rounded-full bg-[#2817BB]' : 'h-1.5 w-1.5 rounded-full bg-[#C8C7D0]'}
        />
      ))}
    </View>
  );
}

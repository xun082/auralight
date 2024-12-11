import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import tw from "twrnc";
import { useState, useCallback } from "react";

interface SliderControlProps {
  icon: string;
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  minimumTrackTintColor: string;
}

const SliderControl: React.FC<SliderControlProps> = ({
  icon,
  label,
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  minimumTrackTintColor,
}) => {
  // 用于显示的值
  const [displayValue, setDisplayValue] = useState(value);

  // 处理滑动中的值变化
  const handleSlidingChange = useCallback((val: number) => {
    // 限制到小数点后2位
    const roundedValue = Math.round(val * 100) / 100;
    setDisplayValue(roundedValue);
  }, []);

  // 处理滑动结束时的值
  const handleSlidingComplete = useCallback(
    (val: number) => {
      // 限制到小数点后2位
      const roundedValue = Math.round(val * 100) / 100;
      setDisplayValue(roundedValue);
      onValueChange(roundedValue);
    },
    [onValueChange]
  );

  return (
    <View>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-white text-base mr-2`}>{icon}</Text>
          <Text style={tw`text-white text-sm`}>{label}</Text>
        </View>
        <Text style={tw`text-white text-sm`}>
          {Math.round(displayValue * 100)}%
        </Text>
      </View>
      <Slider
        style={tw`w-full h-6`}
        value={value}
        onValueChange={handleSlidingChange}
        onSlidingComplete={handleSlidingComplete}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor="#333333"
        thumbTintColor="#FFFFFF"
        step={0.01} // 添加步进值
      />
    </View>
  );
};

export default SliderControl;

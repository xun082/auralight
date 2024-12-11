import {
  View,
  Pressable,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";

import tw from "twrnc";
import { useState, useEffect } from "react";
import * as Brightness from "expo-brightness";

import SliderControl from "../components/slider";
import { PresetColor, PRESET_COLORS, getFinalColor } from "../utils";

interface TemperatureSliderProps {
  temperature: number;
  setTemperature: (value: number) => void;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface RGBColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
}

// 修改自定义颜色视图部分，添加屏幕亮度控制
export default function LightPage() {
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].color);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [brightness, setBrightness] = useState(0.8);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [temperature, setTemperature] = useState(5500);
  const [intensity, setIntensity] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePresetPress = (preset: PresetColor, index: number) => {
    setSelectedColor(preset.color);
    setSelectedIndex(index);
    if (preset.intensity) setIntensity(preset.intensity);
    if (preset.temperature) setTemperature(preset.temperature);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setSelectedIndex(-1);
  };

  // 处理预览区域点击
  const handlePreviewPress = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 请求权限并设置初始亮度
  useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === "granted") {
        // 获取当前系统亮度
        const brightness = await Brightness.getBrightnessAsync();
        setBrightness(brightness);
      }
    })();
  }, []);

  // 处理亮度变化
  const handleBrightnessChange = async (value: number) => {
    try {
      await Brightness.setBrightnessAsync(value);
      setBrightness(value);
    } catch (error) {
      console.error("设置亮度失败:", error);
    }
  };

  if (isFullscreen) {
    return (
      <View style={tw`flex-1`}>
        <StatusBar hidden={true} />
        <Pressable
          onPress={handlePreviewPress}
          style={[
            tw`absolute w-full h-full`,
            {
              backgroundColor: getFinalColor(selectedColor, temperature),
              opacity: intensity,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <StatusBar
        hidden={false}
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={tw`flex-1 px-5 pt-4`}>
        <Pressable
          onPress={handlePreviewPress}
          style={[
            tw`h-[18%] rounded-[24px] mb-6 shadow-2xl`,
            {
              backgroundColor: getFinalColor(selectedColor, temperature),
              opacity: intensity,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
            },
          ]}
        />

        <View style={tw`bg-[#1A1A1A] rounded-[24px] p-6 flex-1 shadow-2xl`}>
          {!showColorPicker ? (
            <View style={tw`flex-1`}>
              <Text style={tw`text-white text-xl font-semibold mb-4`}>
                场景预设
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={tw`mb-5 h-[240px]`}
                contentContainerStyle={tw`pr-5`}
              >
                <View>
                  {/* 第一行预设 */}
                  <View style={tw`flex-row mb-4`}>
                    {PRESET_COLORS.slice(
                      0,
                      Math.ceil(PRESET_COLORS.length / 2)
                    ).map((preset, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[tw`items-center mr-3`, { width: 70 }]}
                        onPress={() => handlePresetPress(preset, index)}
                      >
                        <View
                          style={[
                            tw`w-14 h-14 rounded-2xl mb-2 shadow-lg`,
                            {
                              backgroundColor: preset.color,
                              shadowColor: preset.color,
                              shadowOffset: { width: 0, height: 3 },
                              shadowOpacity: 0.3,
                              shadowRadius: 5,
                            },
                            selectedIndex === index &&
                              tw`border-[2px] border-blue-500`,
                          ]}
                        />
                        <Text
                          style={tw`text-white text-[12px] font-medium mb-0.5 text-center`}
                        >
                          {preset.name}
                        </Text>
                        <Text
                          style={tw`text-[#888888] text-[10px] text-center`}
                        >
                          {preset.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* 第二行预设 */}
                  <View style={tw`flex-row`}>
                    {PRESET_COLORS.slice(
                      Math.ceil(PRESET_COLORS.length / 2)
                    ).map((preset, index) => (
                      <TouchableOpacity
                        key={index + Math.ceil(PRESET_COLORS.length / 2)}
                        style={[tw`items-center mr-3`, { width: 70 }]}
                        onPress={() =>
                          handlePresetPress(
                            preset,
                            index + Math.ceil(PRESET_COLORS.length / 2)
                          )
                        }
                      >
                        <View
                          style={[
                            tw`w-14 h-14 rounded-2xl mb-2.5 shadow-lg`,
                            {
                              backgroundColor: preset.color,
                              shadowColor: preset.color,
                              shadowOffset: { width: 0, height: 3 },
                              shadowOpacity: 0.3,
                              shadowRadius: 5,
                            },
                            selectedIndex ===
                              index + Math.ceil(PRESET_COLORS.length / 2) &&
                              tw`border-[2px] border-blue-500`,
                          ]}
                        />
                        <Text
                          style={tw`text-white text-[12px] font-medium mb-1 text-center`}
                        >
                          {preset.name}
                        </Text>
                        <Text
                          style={tw`text-[#888888] text-[10px] text-center`}
                        >
                          {preset.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <Pressable
                style={tw`bg-[#252525] py-3.5 rounded-2xl mb-5 shadow-md active:opacity-90`}
                onPress={() => setShowColorPicker(true)}
              >
                <Text
                  style={tw`text-white text-center font-semibold text-[15px]`}
                >
                  自定义颜色
                </Text>
              </Pressable>

              <View style={tw`space-y-4`}>
                <SliderControl
                  icon="💡"
                  label="光照强度"
                  value={intensity}
                  onValueChange={setIntensity}
                  minimumValue={0.1}
                  maximumValue={1}
                  minimumTrackTintColor="#3B82F6"
                />

                <TemperatureSlider
                  temperature={temperature}
                  setTemperature={setTemperature}
                />

                <SliderControl
                  icon="✨"
                  label="屏幕亮度"
                  value={brightness}
                  onValueChange={handleBrightnessChange}
                  minimumValue={0.1}
                  maximumValue={1}
                  minimumTrackTintColor="#FFFFFF"
                />
              </View>
            </View>
          ) : (
            <View style={tw`flex-1`}>
              <View style={tw`flex-row justify-between items-center mb-5`}>
                <Text style={tw`text-white text-lg font-medium`}>
                  自定义颜色
                </Text>
                <Pressable
                  onPress={() => setShowColorPicker(false)}
                  style={tw`bg-[#333333] px-5 py-2 rounded-full active:opacity-90`}
                >
                  <Text style={tw`text-white text-sm font-medium`}>返回</Text>
                </Pressable>
              </View>

              <View style={tw`flex-1`}>
                <RGBColorPicker
                  color={selectedColor}
                  onColorChange={handleColorChange}
                />
              </View>

              <View style={tw` mt-6`}>
                <SliderControl
                  icon="💡"
                  label="光照强度"
                  value={intensity}
                  onValueChange={setIntensity}
                  minimumValue={0.1}
                  maximumValue={1}
                  minimumTrackTintColor="#3B82F6"
                />

                <TemperatureSlider
                  temperature={temperature}
                  setTemperature={setTemperature}
                />

                <SliderControl
                  icon="✨"
                  label="屏幕亮度"
                  value={brightness}
                  onValueChange={handleBrightnessChange}
                  minimumValue={0.1}
                  maximumValue={1}
                  minimumTrackTintColor="#FFFFFF"
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// TemperatureSlider 组件样式优化
const TemperatureSlider: React.FC<TemperatureSliderProps> = ({
  temperature,
  setTemperature,
}) => (
  <View>
    <View style={tw`flex-row justify-between items-center mb-3`}>
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-white text-base mr-2`}>🌡️</Text>
        <Text style={tw`text-white text-[15px]`}>色温</Text>
      </View>
      <Text style={tw`text-white text-[13px]`}>
        {temperature}K (
        {temperature <= 3500 ? "暖色" : temperature >= 6500 ? "冷色" : "中性"})
      </Text>
    </View>
    <Slider
      style={tw`w-full h-6`}
      value={temperature}
      onValueChange={setTemperature}
      minimumValue={2000}
      maximumValue={7500}
      minimumTrackTintColor="#FF9800"
      maximumTrackTintColor="#4FC3F7"
      thumbTintColor="#FFFFFF"
    />
    <View style={tw`flex-row justify-between mt-2`}>
      <Text style={tw`text-[#888888] text-xs`}>暖色 2000K</Text>
      <Text style={tw`text-[#888888] text-xs`}>冷色 7500K</Text>
    </View>
  </View>
);

// 添加 RGB 颜色选择器组件
const RGBColorPicker: React.FC<RGBColorPickerProps> = ({
  color,
  onColorChange,
}) => {
  // 将十六进制颜色转换为 RGB
  const hexToRgb = (hex: string): RGBColor | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // 将 RGB 转换为十六进制
  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number): string => {
      const hex = n.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
  };

  const initialRgb = hexToRgb(color) || { r: 255, g: 255, b: 255 };
  const [red, setRed] = useState<number>(initialRgb.r);
  const [green, setGreen] = useState<number>(initialRgb.g);
  const [blue, setBlue] = useState<number>(initialRgb.b);

  const handleColorChange = (r: number, g: number, b: number) => {
    const newColor = rgbToHex(r, g, b);
    onColorChange(newColor);
  };

  // 更新选中点的位置
  useEffect(() => {
    const rgb = hexToRgb(color);
    if (rgb) {
      setRed(rgb.r);
      setGreen(rgb.g);
      setBlue(rgb.b);
    }
  }, [color]);

  // 添加点击位置状态
  const [touchPoint, setTouchPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  // 处理预览区域点击
  const handlePreviewPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setTouchPoint({ x: locationX, y: locationY });
  };

  return (
    <View style={tw`space-y-6`}>
      {/* 颜色预览区域 */}
      <TouchableOpacity onPress={handlePreviewPress} style={tw`relative`}>
        <View
          style={[
            tw`w-full h-32 rounded-2xl mb-6`,
            { backgroundColor: rgbToHex(red, green, blue) },
          ]}
        />
        {touchPoint && (
          <View
            style={[
              tw`absolute w-6 h-6 rounded-full border-2 border-white`,
              {
                left: touchPoint.x - 12,
                top: touchPoint.y - 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              },
            ]}
          />
        )}
      </TouchableOpacity>

      {/* Red slider */}
      <View>
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`text-white text-[15px]`}>红色</Text>
          <Text style={tw`text-white text-[13px]`}>{red}</Text>
        </View>
        <Slider
          value={red}
          onValueChange={(value: number) => {
            const newRed = Math.round(value);
            setRed(newRed);
            handleColorChange(newRed, green, blue);
          }}
          minimumValue={0}
          maximumValue={255}
          minimumTrackTintColor="#FF0000"
          maximumTrackTintColor="#333333"
          thumbTintColor="#FF0000"
          style={tw`h-6`}
        />
      </View>

      {/* Green slider */}
      <View>
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`text-white text-[15px]`}>绿色</Text>
          <Text style={tw`text-white text-[13px]`}>{green}</Text>
        </View>
        <Slider
          value={green}
          onValueChange={(value: number) => {
            const newGreen = Math.round(value);
            setGreen(newGreen);
            handleColorChange(red, newGreen, blue);
          }}
          minimumValue={0}
          maximumValue={255}
          minimumTrackTintColor="#00FF00"
          maximumTrackTintColor="#333333"
          thumbTintColor="#00FF00"
          style={tw`h-6`}
        />
      </View>

      {/* Blue slider */}
      <View>
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`text-white text-[15px]`}>蓝色</Text>
          <Text style={tw`text-white text-[13px]`}>{blue}</Text>
        </View>
        <Slider
          value={blue}
          onValueChange={(value: number) => {
            const newBlue = Math.round(value);
            setBlue(newBlue);
            handleColorChange(red, green, newBlue);
          }}
          minimumValue={0}
          maximumValue={255}
          minimumTrackTintColor="#0000FF"
          maximumTrackTintColor="#333333"
          thumbTintColor="#0000FF"
          style={tw`h-6`}
        />
      </View>
    </View>
  );
};

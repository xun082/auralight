export interface PresetColor {
  name: string;
  color: string;
  intensity?: number;
  temperature?: number;
  description?: string;
}

export const PRESET_COLORS: PresetColor[] = [
  {
    name: "自然光",
    color: "#FFFFFF",
    intensity: 0.8,
    temperature: 5500,
    description: "日常拍摄",
  },
  {
    name: "柔和光",
    color: "#FFF5E6",
    intensity: 0.65,
    temperature: 3000,
    description: "温柔气质",
  },
  {
    name: "暖肤色",
    color: "#FFE4C4",
    intensity: 0.7,
    temperature: 2700,
    description: "美妆修容",
  },
  {
    name: "冷白光",
    color: "#F5F5F5",
    intensity: 0.9,
    temperature: 6500,
    description: "清透感",
  },
  {
    name: "日落光",
    color: "#FFB6C1",
    intensity: 0.5,
    temperature: 2000,
    description: "黄金时刻",
  },
  {
    name: "珍珠光",
    color: "#FAFAFA",
    intensity: 0.75,
    temperature: 4200,
    description: "高级感",
  },
  {
    name: "奶油光",
    color: "#FFF8DC",
    intensity: 0.6,
    temperature: 2800,
    description: "温暖柔和",
  },
  {
    name: "月光",
    color: "#F0F8FF",
    intensity: 0.7,
    temperature: 6800,
    description: "清冷感",
  },
  {
    name: "晨曦光",
    color: "#FFF0E6",
    intensity: 0.7,
    temperature: 3500,
    description: "清晨氛围",
  },
  {
    name: "霓虹光",
    color: "#FF69B4",
    intensity: 0.6,
    temperature: 4000,
    description: "都市夜景",
  },
  {
    name: "暖阳光",
    color: "#FFD700",
    intensity: 0.75,
    temperature: 2500,
    description: "温暖氛围",
  },
  {
    name: "银光",
    color: "#F8F8FF",
    intensity: 0.85,
    temperature: 7000,
    description: "冷调质感",
  },
  {
    name: "蜜桃光",
    color: "#FFE4E1",
    intensity: 0.65,
    temperature: 2900,
    description: "少女感",
  },
  {
    name: "暮光",
    color: "#DDA0DD",
    intensity: 0.55,
    temperature: 3200,
    description: "浪漫黄昏",
  },
  {
    name: "极光",
    color: "#E0FFFF",
    intensity: 0.8,
    temperature: 6200,
    description: "梦幻感",
  },
  {
    name: "香槟光",
    color: "#FFE5B4",
    intensity: 0.7,
    temperature: 3100,
    description: "高雅质感",
  },
];

const kelvinToRGB = (kelvin: number) => {
  const temp = kelvin / 100;
  let red, green, blue;

  if (temp <= 66) {
    red = 255;
    green = temp;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;
    if (temp <= 19) {
      blue = 0;
    } else {
      blue = temp - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
    }
  } else {
    red = temp - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);
    green = temp - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);
    blue = 255;
  }

  return {
    r: Math.min(255, Math.max(0, Math.round(red))),
    g: Math.min(255, Math.max(0, Math.round(green))),
    b: Math.min(255, Math.max(0, Math.round(blue))),
  };
};

// 添加颜色混合函数
export const getFinalColor = (baseColor: string, temperature: number) => {
  // 将十六进制颜色转换为RGB
  const base = {
    r: parseInt(baseColor.slice(1, 3), 16),
    g: parseInt(baseColor.slice(3, 5), 16),
    b: parseInt(baseColor.slice(5, 7), 16),
  };

  // 获取色温对应的RGB
  const temp = kelvinToRGB(temperature);

  // 混合颜色
  const r = Math.round((base.r + temp.r) / 2);
  const g = Math.round((base.g + temp.g) / 2);
  const b = Math.round((base.b + temp.b) / 2);

  // 转回十六进制
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

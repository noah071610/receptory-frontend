export const colors = {
  white: "rgba(255,255,255,1)",
  textWhite: "rgba(255,255,255,1)",
  black: "rgba(0,0,0,1)",
  ctaColor: "rgba(14, 32, 196, 0.5)",
  backgroundDefaultColor: "rgba(14, 32, 196, 0.5)",

  blueSoft: "rgba(220, 224, 255, 0.5)",
  blue: "rgba(117, 130, 253, 1)",
  blueHard: "rgba(77, 94, 255, 1)",

  graySoftest: "rgba(225,225,225,0.15)",
  graySoft: "rgba(235,235,235,0.45)",
  gray: "rgba(161,161,161,0.6)",
  grayHard: "rgba(158,158,158,1)",

  border: "rgba(214,214,218,0.7)",

  purple: "rgba(217,171,255,0.87)",
  purpleHard: "rgba(170,68,254,1)",

  orange: "rgba(255,182,126,0.87)",
  orangeHover: "rgba(255,148,34,0.87)",

  blackSoft: "rgba(73,73,73, 1)",

  bgColor: "rgba(249,249,249,0.8)",
  shadowColor: "rgba(0,0,0,0.08)",

  red: "rgb(255, 93, 90)",

  inputColor: "rgba(234,234,234,0.67)",
  radialBg: "radial-gradient(circle, rgba(255,255,255,1) 70%, rgba(255,241,244,1) 100%)",
  blackTransparent: "rgba(0,0,0,0.10)",
  overlay: "rgba(0,0,0,0.30)",

  green: "rgba(99,206,99,0.90)",
  greenHard: "rgba(81,255,81,0.90)",
}

export const textColorArr = [
  "rgba(0, 0, 0, 0.9)",
  "rgba(255, 0, 0, 0.9)",
  "rgba(0, 255, 0, 0.9)",
  "rgba(0, 0, 255, 0.9)",
  "rgba(255, 255, 0, 0.9)",
  "rgba(255, 0, 255, 0.9)",
  "rgba(0, 255, 255, 0.9)",
  "rgba(255, 153, 0, 0.9)",
  "rgba(153, 0, 255, 0.9)",
  "rgba(0, 153, 255, 0.9)",
  "rgba(153, 255, 0, 0.9)",
  "rgba(255, 153, 255, 0.9)",
  "rgba(0, 255, 153, 0.9)",
  "rgba(153, 0, 0, 0.9)",
  "rgba(0, 153, 0, 0.9)",
  "rgba(0, 0, 153, 0.9)",
  "rgba(153, 153, 0, 0.9)",
  "rgba(153, 0, 153, 0.9)",
  "rgba(0, 153, 153, 0.9)",
  "rgba(153, 153, 153, 0.9)",
  "rgba(255, 255, 255, 0.9)",
]

export const backgroundColors = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(234,147,31,0.2)",
  "rgba(123,123,123,0.2)",
  "rgba(152, 251, 152, 0.2)",
  "rgba(187,201,254, 0.2)",
  "rgba(235,31,32, 0.2)",
  "rgba(100, 200, 50, 0.2)",
  "rgba(10, 150, 200, 0.2)",
  "rgba(200, 100, 150, 0.2)",
  "rgba(50, 50, 100, 0.2)",
  "rgba(150, 200, 10, 0.2)",
  "rgba(200, 50, 100, 0.2)",
]

export const borderColors = backgroundColors.map((v) => v.replace("0.2)", "1)"))

export const bgColorArr = textColorArr.map((v) => v.replace("0.9)", "0.2)"))

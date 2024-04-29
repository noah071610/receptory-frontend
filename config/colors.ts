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

export const colors = {
  white: "#ffffff",
  textWhite: "#ffffff",
  black: "black",

  pinkSoft: "#FFB0B0B3",
  pink: "#FF8A8ADF",
  pinkHard: "#E56A6AE6",

  graySoftest: "#E1E1E124",
  graySoft: "#EBEBEB73",
  gray: "#A1A1A199",
  grayHard: "#9E9E9E",

  border: "#D6D6DAB3",

  purple: "#D9ABFFDE",
  purpleHard: "#AA44FE",

  orange: "#FFB67EDE",
  orangeHover: "#FF9422E6",

  blackSoft: "#434348",

  bgColor: "#F9F9F9CC",
  shadowColor: "#00000014",

  red: "#FF524FB3",

  inputColor: "#EAEAEAAA",
  radialBg: "radial-gradient(circle, #FFFFFF 70%, #FFF1F4 100%)",
  blackTransparent: "#0000001A",
  overlay: "#0000004D",

  green: "#63CE63E6",
  greenHard: "#51FF51E6",
}

export const defaultColors = {
  bgColor: colors.white,
  ctaColor: colors.purple,
  textColor: colors.blackSoft,
  mainColor: colors.white,
  subColor: colors.white,
}

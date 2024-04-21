export default function getContrastTextColor(hexColor: string) {
  // HEX 코드를 RGB 값으로 변환합니다.
  const hex = hexColor.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // RGB 값을 통해 밝기를 계산합니다.
  const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000)

  // 밝기가 125 이상이면 검은색을 반환하고, 그렇지 않으면 흰색을 반환합니다.
  return brightness > 125 ? "#505056" : "#ffffff"
}

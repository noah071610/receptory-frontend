import { colors } from "@/config/colors"

export default function getContrastTextColor(rgbaString: string) {
  // rgba 색상 문자열에서 RGB 값을 추출
  const rgbValues = rgbaString.match(/\d+/g)
  if (rgbValues && rgbValues?.length > 2) {
    const r = parseInt(rgbValues[0])
    const g = parseInt(rgbValues[1])
    const b = parseInt(rgbValues[2])

    // RGB 값을 사용하여 Contrast Text Color를 구함
    return getContrastTextColorFromRGBA({ r, g, b })
  } else {
    return colors.black
  }
}

function getContrastTextColorFromRGBA({ r, g, b }: { r: any; g: any; b: any }) {
  // RGB 값을 사용하여 HSL로 변환
  const hslColor = rgbToHsl(r, g, b)

  // 색상의 밝기(Lightness) 확인
  const lightness = hslColor[2]

  // 밝기가 50%보다 큰 경우 밝은 텍스트(검은색) 반환, 그렇지 않으면 어두운 텍스트(흰색) 반환
  return lightness ? (lightness > 0.5 ? colors.black : colors.white) : colors.black
}

// RGB 값을 사용하여 HSL로 변환하는 함수
function rgbToHsl(r: any, g: any, b: any) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0 // 그레이 스케일
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h && (h /= 6)
  }

  return [h, s, l]
}

// export default function getContrastTextColor(hexColor: string) {
//   // HEX 코드를 RGB 값으로 변환합니다.
//   const hex = hexColor.replace("#", "")
//   const r = parseInt(hex.substring(0, 2), 16)
//   const g = parseInt(hex.substring(2, 4), 16)
//   const b = parseInt(hex.substring(4, 6), 16)

//   // RGB 값을 통해 밝기를 계산합니다.
//   const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000)

//   // 밝기가 125 이상이면 검은색을 반환하고, 그렇지 않으면 흰색을 반환합니다.
//   return brightness > 125 ? colors.blackSoft : colors.white
// }

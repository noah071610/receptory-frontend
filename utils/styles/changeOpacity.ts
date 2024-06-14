export function changeOpacity(rgbaString: string, newOpacity: number = 0.2) {
  // rgba 문자열에서 각 색상 값 추출
  const rgbaValues = rgbaString.match(/[\d.]+/g)
  if (!rgbaValues || !rgbaValues[3]) return rgbaString
  // 투명도 값만 변경
  rgbaValues[3] = newOpacity.toString()

  // 변경된 값으로 새로운 rgba 문자열 생성
  const newRgbaString = `rgba(${rgbaValues.join(",")})`

  return newRgbaString
}

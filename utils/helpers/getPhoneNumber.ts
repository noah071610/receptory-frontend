export const getPhoneNumber = (e: any, phoneNumberCountry: string): string => {
  let input = e.target.value.replace(/[^0-9]/g, "")

  let formattedNumber = ""

  if (phoneNumberCountry === "th") {
    if (input.length <= 5) {
      formattedNumber = input
    } else if (input.length <= 9) {
      formattedNumber = input.slice(0, 3) + "-" + input.slice(3)
    } else if (input.length <= 11) {
      formattedNumber = input.slice(0, 3) + "-" + input.slice(3, 6) + "-" + input.slice(6)
    } else {
      formattedNumber = input.slice(0, 3) + "-" + input.slice(3, 6) + "-" + input.slice(6, 10)
    }
  }

  if (phoneNumberCountry === "en") {
    if (input.length <= 3) {
      formattedNumber = input
    } else if (input.length <= 6) {
      formattedNumber = "(" + input.slice(0, 3) + ") " + input.slice(3)
    } else {
      formattedNumber = "(" + input.slice(0, 3) + ") " + input.slice(3, 6) + "-" + input.slice(6, 10)
    }
  }

  if (phoneNumberCountry === "ko" || phoneNumberCountry === "ja") {
    if (input.length <= 5) {
      formattedNumber = input
    } else if (input.length <= 9) {
      formattedNumber = input.slice(0, 3) + "-" + input.slice(3)
    } else if (input.length <= 12) {
      formattedNumber = input.slice(0, 3) + "-" + input.slice(3, 7) + "-" + input.slice(7)
    } else {
      formattedNumber = input.slice(0, 3) + "-" + input.slice(3, 7) + "-" + input.slice(7, 11)
    }
  }

  return formattedNumber
}

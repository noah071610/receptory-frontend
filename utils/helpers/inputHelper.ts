export function enforceMinMax(e: any) {
  if (e.target.value != "") {
    if (parseInt(e.target.value) < parseInt(e.target.min)) {
      e.target.value = e.target.min
    }
    if (parseInt(e.target.value) > parseInt(e.target.max)) {
      e.target.value = e.target.max
    }
  }
}

export function enforceStringMinMax(e: any) {
  if (e.target.value != "") {
    if (e.target.value.length > parseInt(e.target.max)) {
      e.target.value = e.target.value.slice(0, parseInt(e.target.max))
      e.preventDefault()
    }
  }
}

export function onlyNumberFilter(evt: any) {
  ;(evt.key === "e" || evt.key === "." || evt.key === "-") && evt.preventDefault()
  enforceMinMax(evt)
}

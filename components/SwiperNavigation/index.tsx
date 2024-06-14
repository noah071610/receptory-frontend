"use client"

import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { Swiper, SwiperProps, SwiperRef } from "swiper/react"
import { Swiper as SwiperType } from "swiper/types"
import style from "./style.module.scss"
const cx = cs.bind(style)

interface Props extends SwiperProps {
  prevArrowClassName?: string
  nextArrowClassName?: string
  perSlideView?: number
  isSingle?: boolean
}

const SwiperNavigation = ({
  children,
  prevArrowClassName,
  nextArrowClassName,
  perSlideView,
  isSingle,
  ...swiperProps
}: Props) => {
  const [disable, setDisable] = useState({ prev: true, next: false })
  const sliderRef = useRef(null)

  const handlePrev = useCallback(() => {
    if (!sliderRef?.current) return
    ;(sliderRef?.current as SwiperRef).swiper.slideTo(
      (sliderRef?.current as SwiperRef).swiper.activeIndex - (perSlideView ?? 0)
    )
  }, [perSlideView])

  const handleNext = useCallback(() => {
    if (!sliderRef?.current) return
    ;(sliderRef?.current as SwiperRef).swiper.slideTo(
      (sliderRef?.current as SwiperRef).swiper.activeIndex + (perSlideView ?? 0)
    )
  }, [perSlideView])

  const onSlideChange = (swiper: SwiperType) => {
    if (swiper.realIndex === 0) {
      return setDisable({ prev: true, next: false })
    }
    if (swiper.isEnd) {
      return setDisable({ prev: false, next: true })
    }
    setDisable({ prev: false, next: false })
  }

  useEffect(() => {
    if (isSingle) {
      setDisable({ prev: true, next: true })
    } else {
      setDisable({ prev: true, next: false })
    }
  }, [isSingle])

  return (
    <Swiper {...swiperProps} onSlideChange={onSlideChange} ref={sliderRef}>
      {children}
      <button
        disabled={disable.prev}
        className={cx(prevArrowClassName ?? style.prev, { disable: disable.prev })}
        onClick={handlePrev}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        disabled={disable.next}
        className={cx(nextArrowClassName ?? style.next, { disable: disable.next })}
        onClick={handleNext}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </Swiper>
  )
}

export default memo(SwiperNavigation)

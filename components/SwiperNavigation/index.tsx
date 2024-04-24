import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo, useCallback, useRef, useState } from "react"
import { Swiper, SwiperProps, SwiperRef } from "swiper/react"
import { Swiper as SwiperType } from "swiper/types"
import style from "./style.module.scss"
const cx = classNames.bind(style)

interface Props extends SwiperProps {
  prevArrowClassName?: string
  nextArrowClassName?: string
  perSlideView?: number
}

export const SwiperNavigation = memo(
  ({ children, prevArrowClassName, nextArrowClassName, perSlideView, ...swiperProps }: Props) => {
    const [disable, setDisable] = useState({ prev: true, next: false })
    const sliderRef = useRef(null)

    const handlePrev = useCallback(() => {
      if (!sliderRef?.current) return
      ;(sliderRef?.current as SwiperRef).swiper.slideTo(
        (sliderRef?.current as SwiperRef).swiper.activeIndex - (perSlideView ?? 0)
      )
    }, [sliderRef?.current, perSlideView])

    const handleNext = useCallback(() => {
      if (!sliderRef?.current) return
      ;(sliderRef?.current as SwiperRef).swiper.slideTo(
        (sliderRef?.current as SwiperRef).swiper.activeIndex + (perSlideView ?? 0)
      )
    }, [sliderRef?.current, perSlideView])

    const onSlideChange = (swiper: SwiperType) => {
      if (swiper.realIndex === 0) {
        return setDisable({ prev: true, next: false })
      }
      if (swiper.isEnd) {
        return setDisable({ prev: false, next: true })
      }
      setDisable({ prev: false, next: false })
    }

    return (
      <Swiper {...swiperProps} onSlideChange={onSlideChange} ref={sliderRef}>
        {children}
        <button
          disabled={disable.prev}
          className={cx(prevArrowClassName ?? style.prev, { [style.disable]: disable.prev })}
          onClick={handlePrev}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          disabled={disable.next}
          className={cx(nextArrowClassName ?? style.next, { [style.disable]: disable.next })}
          onClick={handleNext}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </Swiper>
    )
  }
)

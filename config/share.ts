export const shareProviders = [
  { value: "twitter", label: "twitter", color: "rgba(29, 161, 242, 0.2)" }, // 트위터 파란색
  { value: "facebook", label: "facebook", color: "rgba(24, 119, 242, 0.2)" }, // 페이스북 파란색
  { value: "kakaoTalk", label: "kakaoTalk", color: "rgba(255, 235, 0, 0.2)" }, // 카카오톡 노란색
  { value: "line", label: "line", color: "rgba(0, 195, 0, 0.2)" }, // 라인 녹색
  { value: "link", label: "link", color: "rgba(0, 0, 0, 0.2)" }, // 특별한 색상이 없음
]

export const shares = [
  {
    value: "twitter",
    share: ({ text, url }: { text: string; url: string }) => `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
  },
  {
    value: "facebook",
    share: ({ text, url }: { text: string; url: string }) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  },
  {
    value: "line",
    share: ({ text, url }: { text: string; url: string }) =>
      `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`,
  },
]

export const getShareUrl = {
  twitter: ({ text, url }: { text: string; url: string }) => `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
  facebook: ({ text, url }: { text: string; url: string }) =>
    `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
  line: ({ text, url }: { text: string; url: string }) =>
    `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`,
}

export const kakaoShare = ({
  title,
  description,
  imageUrl,
  link,
}: {
  title: string
  description: string
  imageUrl: string
  link: string
}) => {
  if ((window as any).Kakao) {
    const kakao = (window as any).Kakao

    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY)
    }

    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title,
        description,
        imageUrl,
        link: {
          mobileWebUrl: link,
          webUrl: link,
        },
      },
      social: {
        likeCount: 286,
        commentCount: 45,
        sharedCount: 845,
      },
      buttons: [
        {
          title: "지금 플레이하러 가기",
          link: {
            mobileWebUrl: link,
            webUrl: link,
          },
        },
      ],
    })
  }
}

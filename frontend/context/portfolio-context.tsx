"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type ThemeColor = "peach" | "mint" | "lavender" | "coral" | "sky"
export type Language = "ko" | "en"

export interface Artwork {
  id: string
  title: { ko: string; en: string }
  imageUrl: string
  description: { ko: string; en: string }
}

export interface Project {
  id: string
  title: { ko: string; en: string }
  imageUrl: string
  category: string
  description: { ko: string; en: string }
  detailText?: { ko: string; en: string }
  detailImages?: string[]
  externalLink?: string
}

export interface Notice {
  id: string
  title: { ko: string; en: string }
  date: string
  content: { ko: string; en: string }
  category: string
  link?: string
}

export interface SnsLink {
  id: string
  platform: string
  url: string
}

export interface AboutStat {
  id: string
  iconType: string
  value: string
  title: { ko: string; en: string }
  desc: { ko: string; en: string }
}

export interface BGMTrack {
  id: string
  name: string
  artist: string
  url?: string
}

export interface NavLabels {
  gallery: { ko: string; en: string }
  about: { ko: string; en: string }
  notices: { ko: string; en: string }
  contact: { ko: string; en: string }
}

interface PortfolioData {
  heroArtworks: Artwork[]
  projects: Project[]
  projectSettings: {
    title: { ko: string; en: string }
    description: { ko: string; en: string }
    categories: string[]
  }
  notices: Notice[]
  snsLinks: SnsLink[]
  aboutStats: AboutStat[]
  themeColor: ThemeColor
  siteName: { ko: string; en: string }
  tagline: { ko: string; en: string }
  logoImageURL: string
  navLabels: NavLabels
  footerText: { ko: string; en: string }
  bgmTracks: BGMTrack[]
  currentTrackIndex: number
  adminCredentials: { password: string; hint: string }
}

interface PortfolioContextType {
  data: PortfolioData
  updateData: (newData: Partial<PortfolioData>) => void
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
  isEditMode: boolean
  setIsEditMode: (value: boolean) => void
  showAdminModal: boolean
  setShowAdminModal: (value: boolean) => void
  adminPassword: string
  language: Language
  setLanguage: (lang: Language) => void
  t: (text: { ko: string; en: string } | string) => string
}

export const defaultData: PortfolioData = {
  heroArtworks: [
    {
      id: "1",
      title: { ko: "테스트1", en: "Spring Blossoms" },
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&h=600&fit=crop",
      description: { ko: "봄의 색채를 담은 화려한 작품", en: "A vibrant celebration of spring colors" },
    },
    {
      id: "2",
      title: { ko: "테스트2", en: "Ocean Dreams" },
      imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&h=600&fit=crop",
      description: { ko: "바다의 깊이에서 영감을 받은 작품", en: "Inspired by the depths of the sea" },
    },
    {
      id: "3",
      title: { ko: "테스트3", en: "Golden Hour" },
      imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&h=600&fit=crop",
      description: { ko: "일몰의 마법을 담아낸 작품", en: "Capturing the magic of sunset" },
    },
  ],
  projects: [
    {
      id: "1",
      title: { ko: "추상 시리즈", en: "Abstract Series" },
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
      category: "회화",
      description: { ko: "추상적 표현의 컬렉션", en: "A collection of abstract expressions" },
      detailText: { ko: "이 추상 시리즈는 인간의 내면 감정을 시각화하는데 중점을 두었습니다.", en: "This abstract series focuses on visualizing inner human emotions." },
      detailImages: [],
      externalLink: "",
    },
    {
      id: "2",
      title: { ko: "인물 스터디", en: "Portrait Studies" },
      imageUrl: "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400&h=400&fit=crop",
      category: "드로잉",
      description: { ko: "연필로 그린 인물 연구", en: "Character studies in graphite" },
      detailText: { ko: "다양한 표정을 통한 연필 인물 스케치 모음집입니다.", en: "A collection of pencil portrait sketches through various expressions." },
      detailImages: [],
      externalLink: "",
    },
    {
      id: "3",
      title: { ko: "자연 스케치", en: "Nature Sketches" },
      imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop",
      category: "일러스트",
      description: { ko: "식물 일러스트레이션", en: "Botanical illustrations" },
      detailText: { ko: "자연의 아름다움을 펜으로 담아낸 일러스트 작품.", en: "Illustrations capturing the beauty of nature with a pen." },
      detailImages: [],
      externalLink: "",
    },
    {
      id: "4",
      title: { ko: "디지털 꿈", en: "Digital Dreams" },
      imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=400&fit=crop",
      category: "디지털 아트",
      description: { ko: "디지털 매체 탐구", en: "Exploring digital mediums" },
      detailText: { ko: "가상 현실의 한계와 그 매력에 대해 깊이 파고든 디지털 아트 시리즈.", en: "A digital art series delving deeply into the limits of virtual reality and its charm." },
      detailImages: [],
      externalLink: "",
    },
    {
      id: "5",
      title: { ko: "도시 풍경", en: "Urban Landscapes" },
      imageUrl: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400&h=400&fit=crop",
      category: "사진",
      description: { ko: "프레임에 담긴 도시 생활", en: "City life captured in frames" },
      detailText: { ko: "빠르게 변하는 현대 도시의 단면을 포착했습니다.", en: "Captured a cross-section of a rapidly changing modern city." },
      detailImages: [],
      externalLink: "",
    },
    {
      id: "6",
      title: { ko: "수채화 시리즈", en: "Watercolor Series" },
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop",
      category: "회화",
      description: { ko: "부드러운 워시와 흐르는 색채", en: "Soft washes and flowing colors" },
      detailText: { ko: "수채화 특유의 몽환적인 느낌을 강조한 풍경화.", en: "Landscapes highlighting the dreamy feeling unique to watercolors." },
      detailImages: [],
      externalLink: "",
    },
  ],
  projectSettings: {
    title: { ko: "프로젝트 갤러리", en: "Project Gallery" },
    description: { ko: "창작 작품과 예술적 표현을 만나보세요", en: "Discover creative works and artistic expressions" },
    categories: ["전체", "회화", "드로잉", "일러스트", "디지털 아트", "사진"]
  },
  notices: [
    {
      id: "1",
      title: { ko: "새 전시회 오픈", en: "New Exhibition Opening" },
      date: "2026-05-15",
      content: { ko: "갤러리 모던에서 새 전시회가 열립니다. 함께해 주세요.", en: "Join me for the opening of my latest exhibition at Gallery Modern." },
      category: "뉴스",
    },
    {
      id: "2",
      title: { ko: "커미션 예약 오픈", en: "Commission Slots Open" },
      date: "2026-05-01",
      content: { ko: "5월 한정 커미션 예약이 시작되었습니다.", en: "Limited commission slots are now available for May." },
      category: "공지",
    },
    {
      id: "3",
      title: { ko: "워크샵 안내", en: "Workshop Announcement" },
      date: "2026-04-20",
      content: { ko: "이번 주말 수채화 기초 워크샵이 진행됩니다. 지금 등록하세요!", en: "Watercolor basics workshop this weekend. Register now!" },
      category: "업데이트",
    },
  ],
  snsLinks: [
    { id: "1", platform: "Instagram", url: "https://instagram.com" },
    { id: "2", platform: "Twitter", url: "https://twitter.com" },
    { id: "3", platform: "Mail", url: "mailto:your-email@example.com" },
  ],
  aboutStats: [
    {
      id: "stat1",
      iconType: "palette",
      value: "8+",
      title: { ko: "경력", en: "Years of Experience" },
      desc: { ko: "전문 아티스트로 활동", en: "Creating art professionally" },
    },
    {
      id: "stat2",
      iconType: "users",
      value: "150+",
      title: { ko: "완성 프로젝트", en: "Projects Completed" },
      desc: { ko: "전 세계 클라이언트와 협업", en: "For clients worldwide" },
    },
    {
      id: "stat3",
      iconType: "star",
      value: "100+",
      title: { ko: "만족한 고객", en: "Happy Clients" },
      desc: { ko: "그리고 계속 증가 중", en: "And counting" },
    },
  ],
  themeColor: "peach",
  siteName: { ko: "크리에이티브 스튜디오", en: "Creative Studio" },
  tagline: { ko: "상상이 캔버스를 만나는 곳", en: "Where imagination meets canvas" },
  logoImageURL: "",
  navLabels: {
    gallery: { ko: "갤러리", en: "Gallery" },
    about: { ko: "소개", en: "About" },
    notices: { ko: "공지사항", en: "Notices" },
    contact: { ko: "연락처", en: "Contact" },
  },
  footerText: { ko: "© 2026 포트폴리오 사이트. 모든 권리 보유.", en: "© 2026 Portfolio Site. All rights reserved." },
  bgmTracks: [
    { id: "1", name: "Peaceful Morning", artist: "Ambient Sounds" },
    { id: "2", name: "Creative Flow", artist: "Focus Music" },
    { id: "3", name: "Soft Piano", artist: "Classical Vibes" },
  ],
  currentTrackIndex: 0,
  adminCredentials: { password: "1234", hint: "초기 비밀번호는 1234입니다." },
}

function readStorage(key: string) {
  try {
    return typeof window === "undefined" ? null : window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value)
    }
  } catch {
    // Ignore storage failures in private mode or restricted browsers.
  }
}

function removeStorage(key: string) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key)
    }
  } catch {
    // Ignore storage failures in private mode or restricted browsers.
  }
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultData)
  const [isAdmin, setIsAdminState] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [language, setLanguage] = useState<Language>("ko")

  useEffect(() => {
    const savedData = readStorage("portfolioData")
    const savedLang = readStorage("portfolioLanguage") as Language
    const savedIsAdmin = readStorage("portfolioIsAdmin") === "true"
    const savedIsEditMode = readStorage("portfolioIsEditMode") === "true"

    if (savedIsAdmin) {
      setIsAdminState(true)
    }

    if (savedIsEditMode) {
      setIsEditMode(true)
    }

    if (savedData) {
      try {
        setData({ ...defaultData, ...JSON.parse(savedData) })
      } catch {
        setData(defaultData)
      }
    }
    if (savedLang) {
      setLanguage(savedLang)
    }
  }, [])

  const setIsAdmin = (value: boolean) => {
    setIsAdminState(value)
    if (value) {
      writeStorage("portfolioIsAdmin", "true")
    } else {
      removeStorage("portfolioIsAdmin")
    }
  }

  const updateData = (newData: Partial<PortfolioData>) => {
    setData((prev) => {
      const updated = { ...prev, ...newData }
      writeStorage("portfolioData", JSON.stringify(updated))
      return updated
    })
  }

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    writeStorage("portfolioLanguage", lang)
  }

  const t = (text: { ko: string; en: string } | string | undefined): string => {
    if (!text) return ""
    if (typeof text === "string") return text
    return text[language] || text.ko || ""
  }

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateData,
        isAdmin,
        setIsAdmin,
        isEditMode,
        setIsEditMode: (value: boolean) => {
          setIsEditMode(value)
          if (value) {
            writeStorage("portfolioIsEditMode", "true")
          } else {
            removeStorage("portfolioIsEditMode")
          }
        },
        showAdminModal,
        setShowAdminModal,
        adminPassword: data.adminCredentials?.password || "1234",
        language,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      {children}

    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}

// Translations for static UI text
export const translations = {
  nav: {
    gallery: { ko: "갤러리", en: "Gallery" },
    about: { ko: "소개", en: "About" },
    notices: { ko: "공지사항", en: "News" },
    contact: { ko: "연락처", en: "Contact" },
  },
  gallery: {
    title: { ko: "프로젝트 갤러리", en: "Project Gallery" },
    subtitle: { ko: "창작 작품과 예술적 표현을 만나보세요", en: "Explore my creative works and artistic expressions" },
    viewDetails: { ko: "자세히 보기", en: "View Details" },
  },
  categories: {
    all: { ko: "전체", en: "All" },
    painting: { ko: "회화", en: "Painting" },
    drawing: { ko: "드로잉", en: "Drawing" },
    illustration: { ko: "일러스트", en: "Illustration" },
    digitalArt: { ko: "디지털 아트", en: "Digital Art" },
    photography: { ko: "사진", en: "Photography" },
  },
  notices: {
    title: { ko: "공지사항", en: "Notice Board" },
    subtitle: { ko: "최신 소식과 업데이트", en: "Latest announcements and updates" },
    viewAll: { ko: "전체 보기", en: "View All" },
  },
  footer: {
    quickLinks: { ko: "바로가기", en: "Quick Links" },
    connect: { ko: "연결하기", en: "Connect" },
    admin: { ko: "관리자", en: "Admin" },
    allRights: { ko: "모든 권리 보유.", en: "All rights reserved." },
  },
  admin: {
    login: { ko: "관리자 로그인", en: "Admin Login" },
    password: { ko: "비밀번호", en: "Password" },
    enterPassword: { ko: "비밀번호를 입력하세요", en: "Enter admin password" },
    incorrectPassword: { ko: "비밀번호가 틀렸습니다. 다시 시도해주세요.", en: "Incorrect password. Please try again." },
    cancel: { ko: "취소", en: "Cancel" },
    loginBtn: { ko: "로그인", en: "Login" },
    hint: { ko: "힌트: 1234", en: "Hint: 1234" },
    dashboard: { ko: "관리자 대시보드", en: "Admin Dashboard" },
    editMode: { ko: "편집 모드", en: "Edit Mode" },
    exitEditMode: { ko: "편집 모드 종료", en: "Exit Edit Mode" },
    backToSite: { ko: "사이트로 돌아가기", en: "Back to Site" },
    logout: { ko: "로그아웃", en: "Logout" },
  },
  detail: {
    backToGallery: { ko: "갤러리로 돌아가기", en: "Back to Gallery" },
    backToNotices: { ko: "공지사항으로 돌아가기", en: "Back to Notices" },
    category: { ko: "카테고리", en: "Category" },
    date: { ko: "날짜", en: "Date" },
    relatedWorks: { ko: "관련 작품", en: "Related Works" },
  },
}

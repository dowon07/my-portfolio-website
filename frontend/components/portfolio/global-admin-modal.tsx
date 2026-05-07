"use client"

import { useState, useEffect } from "react"
import { usePortfolio, type ThemeColor, type Artwork, type Notice, type AboutStat } from "@/context/portfolio-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { buildApiUrl } from "@/lib/api"
import { Plus, Trash2 } from "lucide-react"

export function GlobalAdminModal() {
  const { data, updateData, showAdminModal, setShowAdminModal, t } = usePortfolio()

  // Basic local states for quick edits (using simple clone for complex edits)
  // For production with deep edits, you'd use a form library, but here we just manually sync
  const [siteNameKo, setSiteNameKo] = useState(data.siteName.ko)
  const [siteNameEn, setSiteNameEn] = useState(data.siteName.en)
  const [taglineKo, setTaglineKo] = useState(data.tagline.ko)
  const [taglineEn, setTaglineEn] = useState(data.tagline.en)
  const [themeColor, setThemeColor] = useState(data.themeColor)

  const defaultBgm = data.bgmTracks[0] || { name: "", artist: "", url: "" }
  const [bgmTitle, setBgmTitle] = useState(defaultBgm.name)
  const [bgmArtist, setBgmArtist] = useState(defaultBgm.artist)
  const [bgmFile, setBgmFile] = useState<File | null>(null)

  // Layout UI states
  const [logoImageURL, setLogoImageURL] = useState(data.logoImageURL || "")

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoImageURL(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const [navGalleryKo, setNavGalleryKo] = useState(data.navLabels?.gallery?.ko || "갤러리")
  const [navGalleryEn, setNavGalleryEn] = useState(data.navLabels?.gallery?.en || "Gallery")
  const [navAboutKo, setNavAboutKo] = useState(data.navLabels?.about?.ko || "소개")
  const [navAboutEn, setNavAboutEn] = useState(data.navLabels?.about?.en || "About")
  const [navNoticesKo, setNavNoticesKo] = useState(data.navLabels?.notices?.ko || "공지사항")
  const [navNoticesEn, setNavNoticesEn] = useState(data.navLabels?.notices?.en || "Notices")
  const [navContactKo, setNavContactKo] = useState(data.navLabels?.contact?.ko || "연락처")
  const [navContactEn, setNavContactEn] = useState(data.navLabels?.contact?.en || "Contact")
  const [footerTextKo, setFooterTextKo] = useState(data.footerText?.ko || "© 2026 포트폴리오 사이트. 모든 권리 보유.")
  const [footerTextEn, setFooterTextEn] = useState(data.footerText?.en || "© 2026 Portfolio Site. All rights reserved.")

  // Hero section setup
  const [heroArtworks, setHeroArtworks] = useState(data.heroArtworks)
  const [projectSettings, setProjectSettings] = useState(data.projectSettings || {
    title: { ko: "프로젝트 갤러리", en: "Project Gallery" },
    description: { ko: "창작 작품과 예술적 표현을 만나보세요", en: "Discover creative works and artistic expressions" },
    categories: ["전체", "회화", "드로잉", "일러스트", "디지털 아트", "사진"]
  })
  const [projects, setProjects] = useState(data.projects || [])
  const [notices, setNotices] = useState(data.notices || [])
  const [snsLinks, setSnsLinks] = useState(data.snsLinks || [])
  const [aboutStats, setAboutStats] = useState(data.aboutStats || [])

  // Security settings state
  const [currentPasswordInput, setCurrentPasswordInput] = useState("")
  const [newPasswordInput, setNewPasswordInput] = useState("")
  const [newPasswordHintInput, setNewPasswordHintInput] = useState("")

  // 즉시 반영: modal 내부에서 항목을 수정하면 전역 상태에 즉시 동기화
  useEffect(() => {
    updateData({ heroArtworks })
  }, [heroArtworks])

  useEffect(() => {
    updateData({ projects })
  }, [projects])

  useEffect(() => {
    updateData({ aboutStats })
  }, [aboutStats])

  useEffect(() => {
    updateData({ notices })
  }, [notices])

  const handleSaveGeneral = async () => {
    let uploadedBgmUrl = defaultBgm.url || ""

    if (bgmFile) {
      const uploadData = new FormData()
      uploadData.append("key", "bgm_1")
      uploadData.append("type", "audio")
      uploadData.append("file", bgmFile)

      try {
        const res = await fetch(buildApiUrl("/api/contents"), {
          method: "POST",
          body: uploadData,
        })
        if (res.ok) {
          const result = await res.json().catch(() => null)
          uploadedBgmUrl = result?.content?.url || URL.createObjectURL(bgmFile)
        }
      } catch (err) {
        console.error("BGM Upload error", err)
      }
    }

    const updatedBgmTrack = {
      id: "1",
      name: bgmTitle,
      artist: bgmArtist,
      url: uploadedBgmUrl,
    }

    updateData({
      siteName: { ko: siteNameKo, en: siteNameEn },
      tagline: { ko: taglineKo, en: taglineEn },
      themeColor: themeColor as any,
      bgmTracks: [updatedBgmTrack],
      heroArtworks: heroArtworks,
      projectSettings: projectSettings,
      projects: projects,
      notices: notices,
      snsLinks: snsLinks,
      aboutStats: aboutStats,
      logoImageURL,
      navLabels: {
        gallery: { ko: navGalleryKo, en: navGalleryEn },
        about: { ko: navAboutKo, en: navAboutEn },
        notices: { ko: navNoticesKo, en: navNoticesEn },
        contact: { ko: navContactKo, en: navContactEn },
      },
      footerText: { ko: footerTextKo, en: footerTextEn },
    })

    setShowAdminModal(false)
  }

  const handleSaveSecurity = () => {
    if (currentPasswordInput !== data.adminCredentials?.password && currentPasswordInput !== "1234") {
      alert("현재 비밀번호가 틀렸습니다.")
      return
    }

    updateData({
      adminCredentials: {
        password: newPasswordInput || currentPasswordInput,
        hint: newPasswordHintInput || data.adminCredentials?.hint || "초기 비밀번호는 1234입니다.",
      }
    })

    alert("보안 설정이 안전하게 저장되었습니다.")
    setCurrentPasswordInput("")
    setNewPasswordInput("")
    setNewPasswordHintInput("")
  }

  // Generic updater for deep arrays
  const updateHeroArtwork = (id: string, field: "title" | "description", lang: 'ko' | 'en', value: string) => {
    setHeroArtworks(prev => prev.map(art => {
      if (art.id === id) {
        const currentValue = art[field]
        return { ...art, [field]: { ...currentValue, [lang]: value } }
      }
      return art
    }))
  }

  const updateProject = (id: string, field: "title" | "description" | "detailText", lang: 'ko' | 'en', value: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === id) {
        const currentObj = (proj as any)[field] || { ko: "", en: "" }
        return { ...proj, [field]: { ...currentObj, [lang]: value } }
      }
      return proj
    }))
  }

  const updateNotice = (id: string, field: "title" | "content", lang: 'ko' | 'en', value: string) => {
    setNotices(prev => prev.map(not => {
      if (not.id === id) {
        const currentValue = not[field]
        return { ...not, [field]: { ...currentValue, [lang]: value } }
      }
      return not
    }))
  }

  const updateAboutStat = (id: string, field: "title" | "desc", lang: 'ko' | 'en', value: string) => {
    setAboutStats(prev => prev.map(stat => {
      if (stat.id === id) {
        const currentValue = stat[field]
        return { ...stat, [field]: { ...currentValue, [lang]: value } }
      }
      return stat
    }))
  }

  const handleAddHeroArtwork = () => {
    const newItem = {
      id: Date.now().toString(),
      title: { ko: "새 배너", en: "New Banner" },
      imageUrl: "",
      description: { ko: "설명을 입력하세요.", en: "Enter description." },
    }
    const newArray = [newItem, ...heroArtworks]
    setHeroArtworks(newArray)
    // 즉시 전역 상태에 반영하여 메인 페이지에 실시간 업데이트
    updateData({ heroArtworks: newArray })
  }

  const handleDeleteHeroArtwork = (id: string) => {
    if (confirm(t({ ko: "정말 이 배너를 삭제하시겠습니까?", en: "Are you sure you want to delete this banner?" }))) {
      const newArray = heroArtworks.filter(art => art.id !== id)
      setHeroArtworks(newArray)
      updateData({ heroArtworks: newArray })
    }
  }

  const handleAddProject = () => {
    const defaultCat = projectSettings.categories.filter(c => c !== "전체")[0] || "전체"
    const newItem = {
      id: Date.now().toString(),
      title: { ko: "새 프로젝트", en: "New Project" },
      imageUrl: "",
      category: defaultCat,
      description: { ko: "프로젝트 요약을 입력하세요.", en: "Enter project summary." },
      detailText: { ko: "", en: "" },
      detailImages: [],
      externalLink: "",
    }
    const newArray = [newItem, ...projects]
    setProjects(newArray)
    updateData({ projects: newArray })
  }

  const handleDeleteProject = (id: string) => {
    if (confirm(t({ ko: "정말 이 프로젝트를 삭제하시겠습니까?", en: "Are you sure you want to delete this project?" }))) {
      const newArray = projects.filter(proj => proj.id !== id)
      setProjects(newArray)
      updateData({ projects: newArray })
    }
  }

  const handleAddNotice = () => {
    const newItem = {
      id: Date.now().toString(),
      title: { ko: "새 공지사항", en: "New Notice" },
      date: new Date().toISOString().split('T')[0],
      category: "공지",
      content: { ko: "내용을 입력하세요.", en: "Enter notice content." },
    }
    const newArray = [newItem, ...notices]
    setNotices(newArray)
    updateData({ notices: newArray })
  }

  const handleDeleteNotice = (id: string) => {
    if (confirm(t({ ko: "정말 이 공지사항을 삭제하시겠습니까?", en: "Are you sure you want to delete this notice?" }))) {
      const newArray = notices.filter(not => not.id !== id)
      setNotices(newArray)
      updateData({ notices: newArray })
    }
  }

  const addCategory = () => {
    const newCategory = prompt("새 카테고리 이름을 입력하세요:")
    if (newCategory && !projectSettings.categories.includes(newCategory)) {
      setProjectSettings(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }))
    }
  }

  const editCategory = (idx: number) => {
    const newCategory = prompt("새로운 카테고리 이름을 입력하세요:", projectSettings.categories[idx])
    if (newCategory && newCategory !== projectSettings.categories[idx]) {
      const oldCat = projectSettings.categories[idx]
      setProjectSettings(prev => {
        const newCats = [...prev.categories]
        newCats[idx] = newCategory
        return { ...prev, categories: newCats }
      })
      // Update projects that use the old category
      setProjects(prev => prev.map(p => p.category === oldCat ? { ...p, category: newCategory } : p))
    }
  }

  const removeCategory = (idx: number) => {
    if (projectSettings.categories[idx] === "전체") {
      alert("'전체' 카테고리는 삭제할 수 없습니다.")
      return
    }
    if (confirm("이 카테고리를 삭제하시겠습니까? 관련 프로젝트의 카테고리가 '전체'로 변경됩니다.")) {
      const catToRemove = projectSettings.categories[idx]
      setProjectSettings(prev => ({
        ...prev,
        categories: prev.categories.filter((_, i) => i !== idx)
      }))
      setProjects(prev => prev.map(p => p.category === catToRemove ? { ...p, category: "전체" } : p))
    }
  }

  return (
    <Dialog open={showAdminModal} onOpenChange={setShowAdminModal}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>통합 관리자 대시보드</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="basic">기본 / BGM</TabsTrigger>
            <TabsTrigger value="about">요약 정보</TabsTrigger>
            <TabsTrigger value="hero">히어로 배너</TabsTrigger>
            <TabsTrigger value="projects">프로젝트</TabsTrigger>
            <TabsTrigger value="notices">공지사항</TabsTrigger>
            <TabsTrigger value="sns">SNS</TabsTrigger>
            <TabsTrigger value="security">보안 설정</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 rounded-xl border p-4">
                <h3 className="font-semibold">사이트 설정</h3>
                <div>
                  <Label>사이트 이름 (ko / en)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={siteNameKo} onChange={e => setSiteNameKo(e.target.value)} placeholder="한국어" />
                    <Input value={siteNameEn} onChange={e => setSiteNameEn(e.target.value)} placeholder="English" />
                  </div>
                </div>
                <div>
                  <Label>사이트 설명 (ko / en)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={taglineKo} onChange={e => setTaglineKo(e.target.value)} placeholder="한국어" />
                    <Input value={taglineEn} onChange={e => setTaglineEn(e.target.value)} placeholder="English" />
                  </div>
                </div>
                <div>
                  <Label>테마 색상</Label>
                  <Input value={themeColor} onChange={e => setThemeColor(e.target.value as ThemeColor)} placeholder="peach, mint, lavender..." className="mt-1" />
                </div>
              </div>

              <div className="space-y-4 rounded-xl border p-4">
                <h3 className="font-semibold">BGM 설정</h3>
                <div>
                  <Label>음악 제목</Label>
                  <Input value={bgmTitle} onChange={e => setBgmTitle(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>아티스트</Label>
                  <Input value={bgmArtist} onChange={e => setBgmArtist(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>BGM 파일 업로드 (.mp3, .wav)</Label>
                  <Input type="file" accept="audio/*" onChange={e => setBgmFile(e.target.files?.[0] || null)} className="mt-1" />
                </div>
              </div>

              <div className="space-y-4 rounded-xl border p-4 col-span-2">
                <h3 className="font-semibold">사이트 로고 및 푸터 설정</h3>
                <div>
                  <Label>사이트 로고 이미지</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {logoImageURL && (
                      <div className="flex-shrink-0 size-12 rounded bg-muted/50 flex items-center justify-center border overflow-hidden">
                        <img src={logoImageURL} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <Input value={logoImageURL} onChange={e => setLogoImageURL(e.target.value)} placeholder="이미지 URL을 입력하거나 파일을 업로드하세요..." />
                      <Input type="file" accept="image/*" onChange={handleLogoUpload} />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>하단 카피라이트 문구 (ko / en)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={footerTextKo} onChange={e => setFooterTextKo(e.target.value)} placeholder="한국어" />
                    <Input value={footerTextEn} onChange={e => setFooterTextEn(e.target.value)} placeholder="English" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border p-4 col-span-2">
                <h3 className="font-semibold">메뉴 이름 설정 (Nav Labels)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">갤러리 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={navGalleryKo} onChange={e => setNavGalleryKo(e.target.value)} className="h-8" />
                      <Input value={navGalleryEn} onChange={e => setNavGalleryEn(e.target.value)} className="h-8" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">소개 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={navAboutKo} onChange={e => setNavAboutKo(e.target.value)} className="h-8" />
                      <Input value={navAboutEn} onChange={e => setNavAboutEn(e.target.value)} className="h-8" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">공지사항 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={navNoticesKo} onChange={e => setNavNoticesKo(e.target.value)} className="h-8" />
                      <Input value={navNoticesEn} onChange={e => setNavNoticesEn(e.target.value)} className="h-8" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">연락처 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={navContactKo} onChange={e => setNavContactKo(e.target.value)} className="h-8" />
                      <Input value={navContactEn} onChange={e => setNavContactEn(e.target.value)} className="h-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">요약 정보 관리 (About/Stats)</h3>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {aboutStats.map(stat => (
                <div key={stat.id} className="rounded-xl border p-4 space-y-3 relative">
                  <h4 className="font-medium text-sm text-primary">항목: {stat.title.ko}</h4>
                  <div>
                    <Label className="text-xs">수치 (value)</Label>
                    <Input 
                      value={stat.value} 
                      onChange={e => setAboutStats(prev => prev.map(s => s.id === stat.id ? { ...s, value: e.target.value } : s))} 
                      className="mt-1 h-8" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">제목 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={stat.title.ko} onChange={e => updateAboutStat(stat.id, 'title', 'ko', e.target.value)} className="h-8" />
                      <Input value={stat.title.en} onChange={e => updateAboutStat(stat.id, 'title', 'en', e.target.value)} className="h-8" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">설명 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Textarea value={stat.desc.ko} onChange={e => updateAboutStat(stat.id, 'desc', 'ko', e.target.value)} className="h-16 resize-none" />
                      <Textarea value={stat.desc.en} onChange={e => updateAboutStat(stat.id, 'desc', 'en', e.target.value)} className="h-16 resize-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hero" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">히어로 배너 관리</h3>
              <Button size="sm" onClick={handleAddHeroArtwork} className="gap-2">
                <Plus className="size-4" /> 새 항목 추가
              </Button>
            </div>
            {heroArtworks.length === 0 && (
              <p className="text-center text-muted-foreground py-8">등록된 콘텐츠가 없습니다.</p>
            )}
            <div className="grid gap-6 md:grid-cols-2">
              {heroArtworks.map(art => (
                <div key={art.id} className="rounded-xl border p-4 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-primary">배너 ID: {art.id}</h4>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteHeroArtwork(art.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs">제목 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={art.title.ko} onChange={e => updateHeroArtwork(art.id, 'title', 'ko', e.target.value)} className="h-8" />
                      <Input value={art.title.en} onChange={e => updateHeroArtwork(art.id, 'title', 'en', e.target.value)} className="h-8" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">설명 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Textarea value={art.description.ko} onChange={e => updateHeroArtwork(art.id, 'description', 'ko', e.target.value)} className="h-16 resize-none" />
                      <Textarea value={art.description.en} onChange={e => updateHeroArtwork(art.id, 'description', 'en', e.target.value)} className="h-16 resize-none" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">이미지 URL</Label>
                    <Input 
                      value={art.imageUrl} 
                      onChange={e => setHeroArtworks(prev => prev.map(p => p.id === art.id ? { ...p, imageUrl: e.target.value } : p))} 
                      className="mt-1 h-8" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="space-y-4 rounded-xl border p-4 bg-muted/20">
              <h3 className="font-semibold text-lg">섹션 설정</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>섹션 제목 (ko / en)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={projectSettings.title.ko} onChange={e => setProjectSettings(prev => ({...prev, title: {...prev.title, ko: e.target.value}}))} placeholder="한국어" />
                    <Input value={projectSettings.title.en} onChange={e => setProjectSettings(prev => ({...prev, title: {...prev.title, en: e.target.value}}))} placeholder="English" />
                  </div>
                </div>
                <div>
                  <Label>섹션 설명 (ko / en)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={projectSettings.description.ko} onChange={e => setProjectSettings(prev => ({...prev, description: {...prev.description, ko: e.target.value}}))} placeholder="한국어" />
                    <Input value={projectSettings.description.en} onChange={e => setProjectSettings(prev => ({...prev, description: {...prev.description, en: e.target.value}}))} placeholder="English" />
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Label className="mb-2 block">카테고리 관리</Label>
                <div className="flex flex-wrap gap-2 items-center">
                  {projectSettings.categories.map((cat, idx) => (
                    <Badge key={idx} variant="secondary" className="px-2 py-1 flex items-center gap-1 group cursor-pointer hover:bg-secondary/80">
                      <span onClick={() => editCategory(idx)}>{cat}</span>
                      {cat !== "전체" && (
                        <button onClick={(e) => { e.stopPropagation(); removeCategory(idx); }} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" onClick={addCategory} className="h-7 px-2 text-xs rounded-full">
                    <Plus className="h-3 w-3 mr-1" /> 추가
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">프로젝트 관리</h3>
              <Button size="sm" onClick={handleAddProject} className="gap-2">
                <Plus className="size-4" /> 새 항목 추가
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map(proj => (
                <div key={proj.id} className="rounded-xl border p-4 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-primary">프로젝트: {proj.title.ko}</h4>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(proj.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs">제목 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={proj.title.ko} onChange={e => updateProject(proj.id, 'title', 'ko', e.target.value)} className="h-8" />
                      <Input value={proj.title.en} onChange={e => updateProject(proj.id, 'title', 'en', e.target.value)} className="h-8" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">설명 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Textarea value={proj.description.ko} onChange={e => updateProject(proj.id, 'description', 'ko', e.target.value)} className="h-16 resize-none" />
                      <Textarea value={proj.description.en} onChange={e => updateProject(proj.id, 'description', 'en', e.target.value)} className="h-16 resize-none" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">카테고리</Label>
                    <select 
                      value={proj.category} 
                      onChange={e => setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, category: e.target.value } : p))}
                      className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background mt-1"
                    >
                      {projectSettings.categories.filter(c => c !== "전체").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">이미지 URL</Label>
                    <Input 
                      value={proj.imageUrl} 
                      onChange={e => setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, imageUrl: e.target.value } : p))} 
                      className="mt-1 h-8" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">상세 본문 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Textarea value={proj.detailText?.ko || ""} onChange={e => updateProject(proj.id, 'detailText', 'ko', e.target.value)} className="h-16 resize-none" placeholder="상세 본문 텍스트 (한국어)" />
                      <Textarea value={proj.detailText?.en || ""} onChange={e => updateProject(proj.id, 'detailText', 'en', e.target.value)} className="h-16 resize-none" placeholder="Detail text (English)" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">외부 링크 (웹툰 보러가기 등)</Label>
                    <Input 
                      value={proj.externalLink || ""} 
                      onChange={e => setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, externalLink: e.target.value } : p))} 
                      className="mt-1 h-8" 
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs">다중 상세 이미지 URLs (쉼표로 구분)</Label>
                    <Input 
                      value={proj.detailImages?.join(',') || ""} 
                      onChange={e => setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, detailImages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } : p))} 
                      className="mt-1 h-8" 
                      placeholder="url1, url2, url3..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notices" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">공지사항 관리</h3>
              <Button size="sm" onClick={handleAddNotice} className="gap-2">
                <Plus className="size-4" /> 새 공지 추가
              </Button>
            </div>
            {notices.length === 0 && (
              <p className="text-center text-muted-foreground py-8">등록된 공지사항이 없습니다.</p>
            )}
            <div className="grid gap-6 md:grid-cols-2">
              {notices.map(notice => (
                <div key={notice.id} className="rounded-xl border p-4 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-primary">공지: {notice.title.ko}</h4>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteNotice(notice.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs">카테고리</Label>
                    <Input 
                      value={notice.category || ""} 
                      onChange={e => setNotices(prev => prev.map(n => n.id === notice.id ? { ...n, category: e.target.value } : n))} 
                      className="mt-1 h-8" 
                      placeholder="예: 뉴스, 공지, 업데이트"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">제목 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={notice.title.ko} onChange={e => updateNotice(notice.id, 'title', 'ko', e.target.value)} className="h-8" />
                      <Input value={notice.title.en} onChange={e => updateNotice(notice.id, 'title', 'en', e.target.value)} className="h-8" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">날짜 (YYYY-MM-DD)</Label>
                    <Input 
                      value={notice.date} 
                      onChange={e => setNotices(prev => prev.map(n => n.id === notice.id ? { ...n, date: e.target.value } : n))} 
                      className="mt-1 h-8" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">내용 (ko / en)</Label>
                    <div className="flex gap-2 mt-1">
                      <Textarea value={notice.content.ko} onChange={e => updateNotice(notice.id, 'content', 'ko', e.target.value)} className="h-16 resize-none" />
                      <Textarea value={notice.content.en} onChange={e => updateNotice(notice.id, 'content', 'en', e.target.value)} className="h-16 resize-none" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">링크 (옵션)</Label>
                    <Input 
                      value={notice.link || ""} 
                      onChange={e => setNotices(prev => prev.map(n => n.id === notice.id ? { ...n, link: e.target.value } : n))} 
                      className="mt-1 h-8" 
                      placeholder="https://..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sns" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {snsLinks.map(sns => (
                <div key={sns.id} className="rounded-xl border p-4 space-y-3">
                  <h4 className="font-medium text-sm text-primary">SNS: {sns.platform}</h4>
                  <div>
                    <Label className="text-xs">플랫폼</Label>
                    <Input 
                      value={sns.platform} 
                      onChange={e => setSnsLinks(prev => prev.map(s => s.id === sns.id ? { ...s, platform: e.target.value } : s))} 
                      className="mt-1 h-8" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">URL</Label>
                    <Input 
                      value={sns.url} 
                      onChange={e => setSnsLinks(prev => prev.map(s => s.id === sns.id ? { ...s, url: e.target.value } : s))} 
                      className="mt-1 h-8" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="max-w-md mx-auto space-y-4 rounded-xl border p-6">
              <h3 className="font-semibold text-lg mb-4">비밀번호 변경</h3>
              <div>
                <Label>현재 비밀번호 (확인용)</Label>
                <Input 
                  type="password"
                  value={currentPasswordInput} 
                  onChange={e => setCurrentPasswordInput(e.target.value)} 
                  className="mt-1" 
                  placeholder="현재 비밀번호를 입력"
                />
              </div>
              <div>
                <Label>새 비밀번호</Label>
                <Input 
                  type="password"
                  value={newPasswordInput} 
                  onChange={e => setNewPasswordInput(e.target.value)} 
                  className="mt-1" 
                  placeholder="새로운 비밀번호 입력"
                />
              </div>
              <div>
                <Label>새 비밀번호 힌트</Label>
                <Input 
                  value={newPasswordHintInput} 
                  onChange={e => setNewPasswordHintInput(e.target.value)} 
                  className="mt-1" 
                  placeholder="예: 초기 비밀번호는 1234입니다."
                />
              </div>
              <Button onClick={handleSaveSecurity} className="w-full mt-4">보안 설정 저장</Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 border-t pt-4">
          <Button variant="outline" onClick={() => setShowAdminModal(false)}>취소</Button>
          <Button onClick={handleSaveGeneral}>저장 후 반영</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
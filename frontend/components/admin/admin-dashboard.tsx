"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  usePortfolio,
  translations,
  type ThemeColor,
  type Artwork,
  type Project,
  type Notice,
  type BGMTrack,
} from "@/context/portfolio-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Settings,
  Image as ImageIcon,
  FileText,
  Bell,
  Palette,
  Music,
  ArrowLeft,
  Plus,
  Trash2,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"

const themeColors: { value: ThemeColor; label: { ko: string; en: string }; color: string }[] = [
  { value: "peach", label: { ko: "따뜻한 피치", en: "Warm Peach" }, color: "bg-orange-200" },
  { value: "mint", label: { ko: "프레시 민트", en: "Fresh Mint" }, color: "bg-emerald-200" },
  { value: "lavender", label: { ko: "소프트 라벤더", en: "Soft Lavender" }, color: "bg-purple-200" },
  { value: "coral", label: { ko: "코랄 핑크", en: "Coral Pink" }, color: "bg-pink-200" },
  { value: "sky", label: { ko: "스카이 블루", en: "Sky Blue" }, color: "bg-sky-200" },
]

export function AdminDashboard() {
  const router = useRouter()
  const {
    data,
    updateData,
    isAdmin,
    setIsAdmin,
    isEditMode,
    setIsEditMode,
    t,
  } = usePortfolio()

  const [newHeroUrl, setNewHeroUrl] = useState("")
  const [newHeroTitle, setNewHeroTitle] = useState({ ko: "", en: "" })
  const [newHeroDesc, setNewHeroDesc] = useState({ ko: "", en: "" })

  const [newProjectUrl, setNewProjectUrl] = useState("")
  const [newProjectTitle, setNewProjectTitle] = useState({ ko: "", en: "" })
  const [newProjectDesc, setNewProjectDesc] = useState({ ko: "", en: "" })
  const [newProjectCategory, setNewProjectCategory] = useState("Painting")

  const [newNoticeTitle, setNewNoticeTitle] = useState({ ko: "", en: "" })
  const [newNoticeContent, setNewNoticeContent] = useState({ ko: "", en: "" })

  const [newBgmName, setNewBgmName] = useState("")
  const [newBgmArtist, setNewBgmArtist] = useState("")

  if (!isAdmin) {
    router.push("/")
    return null
  }

  const handleAddHero = () => {
    if (newHeroUrl && newHeroTitle.ko && newHeroTitle.en) {
      const newArtwork: Artwork = {
        id: Date.now().toString(),
        title: newHeroTitle,
        imageUrl: newHeroUrl,
        description: newHeroDesc,
      }
      updateData({ heroArtworks: [...data.heroArtworks, newArtwork] })
      setNewHeroUrl("")
      setNewHeroTitle({ ko: "", en: "" })
      setNewHeroDesc({ ko: "", en: "" })
    }
  }

  const handleRemoveHero = (id: string) => {
    updateData({ heroArtworks: data.heroArtworks.filter((a) => a.id !== id) })
  }

  const handleAddProject = () => {
    if (newProjectUrl && newProjectTitle.ko && newProjectTitle.en) {
      const newProject: Project = {
        id: Date.now().toString(),
        title: newProjectTitle,
        imageUrl: newProjectUrl,
        category: newProjectCategory,
        description: newProjectDesc,
      }
      updateData({ projects: [...data.projects, newProject] })
      setNewProjectUrl("")
      setNewProjectTitle({ ko: "", en: "" })
      setNewProjectDesc({ ko: "", en: "" })
    }
  }

  const handleRemoveProject = (id: string) => {
    updateData({ projects: data.projects.filter((p) => p.id !== id) })
  }

  const handleAddNotice = () => {
    if (newNoticeTitle.ko && newNoticeTitle.en && newNoticeContent.ko && newNoticeContent.en) {
      const newNotice: Notice = {
        id: Date.now().toString(),
        title: newNoticeTitle,
        date: new Date().toISOString().split("T")[0],
        content: newNoticeContent,
        category: "공지",
      }
      updateData({ notices: [newNotice, ...data.notices] })
      setNewNoticeTitle({ ko: "", en: "" })
      setNewNoticeContent({ ko: "", en: "" })
    }
  }

  const handleRemoveNotice = (id: string) => {
    updateData({ notices: data.notices.filter((n) => n.id !== id) })
  }

  const handleAddBgm = () => {
    if (newBgmName && newBgmArtist) {
      const newTrack: BGMTrack = {
        id: Date.now().toString(),
        name: newBgmName,
        artist: newBgmArtist,
      }
      updateData({ bgmTracks: [...data.bgmTracks, newTrack] })
      setNewBgmName("")
      setNewBgmArtist("")
    }
  }

  const handleRemoveBgm = (id: string) => {
    updateData({ bgmTracks: data.bgmTracks.filter((track) => track.id !== id) })
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setIsEditMode(false)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 size-4" />
              {t(translations.admin.backToSite)}
            </Button>
            <div className="hidden h-6 w-px bg-border md:block" />
            <h1 className="hidden text-lg font-semibold text-foreground md:block">
              {t(translations.admin.dashboard)}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="edit-mode" className="text-sm text-muted-foreground">
                {isEditMode ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </Label>
              <Switch
                id="edit-mode"
                checked={isEditMode}
                onCheckedChange={setIsEditMode}
              />
              <span className="text-sm font-medium">
                {t(translations.admin.editMode)}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 size-4" />
              {t(translations.admin.logout)}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 gap-2 md:grid-cols-6">
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="size-4" />
              <span className="hidden sm:inline">
                {t({ ko: "설정", en: "Settings" })}
              </span>
            </TabsTrigger>
            <TabsTrigger value="hero" className="gap-2">
              <ImageIcon className="size-4" />
              <span className="hidden sm:inline">
                {t({ ko: "히어로", en: "Hero" })}
              </span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FileText className="size-4" />
              <span className="hidden sm:inline">
                {t({ ko: "프로젝트", en: "Projects" })}
              </span>
            </TabsTrigger>
            <TabsTrigger value="notices" className="gap-2">
              <Bell className="size-4" />
              <span className="hidden sm:inline">
                {t({ ko: "공지", en: "Notices" })}
              </span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="gap-2">
              <Palette className="size-4" />
              <span className="hidden sm:inline">
                {t({ ko: "테마", en: "Theme" })}
              </span>
            </TabsTrigger>
            <TabsTrigger value="bgm" className="gap-2">
              <Music className="size-4" />
              <span className="hidden sm:inline">BGM</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t({ ko: "사이트 설정", en: "Site Settings" })}</CardTitle>
                <CardDescription>
                  {t({ ko: "기본 사이트 정보를 수정합니다.", en: "Update your basic site information." })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t({ ko: "사이트 이름 (한국어)", en: "Site Name (Korean)" })}</Label>
                    <Input
                      value={data.siteName.ko}
                      onChange={(e) =>
                        updateData({ siteName: { ...data.siteName, ko: e.target.value } })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t({ ko: "사이트 이름 (영어)", en: "Site Name (English)" })}</Label>
                    <Input
                      value={data.siteName.en}
                      onChange={(e) =>
                        updateData({ siteName: { ...data.siteName, en: e.target.value } })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t({ ko: "태그라인 (한국어)", en: "Tagline (Korean)" })}</Label>
                    <Input
                      value={data.tagline.ko}
                      onChange={(e) =>
                        updateData({ tagline: { ...data.tagline, ko: e.target.value } })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t({ ko: "태그라인 (영어)", en: "Tagline (English)" })}</Label>
                    <Input
                      value={data.tagline.en}
                      onChange={(e) =>
                        updateData({ tagline: { ...data.tagline, en: e.target.value } })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>{t({ ko: "히어로 슬라이더", en: "Hero Slider" })}</CardTitle>
                <CardDescription>
                  {t({ ko: "메인 페이지 슬라이더 이미지를 관리합니다.", en: "Manage your main page slider images." })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-dashed border-border p-4">
                  <h4 className="mb-4 font-medium">
                    {t({ ko: "새 이미지 추가", en: "Add New Image" })}
                  </h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>{t({ ko: "이미지 URL", en: "Image URL" })}</Label>
                      <Input
                        placeholder="https://..."
                        value={newHeroUrl}
                        onChange={(e) => setNewHeroUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t({ ko: "제목 (한국어)", en: "Title (Korean)" })}</Label>
                        <Input
                          value={newHeroTitle.ko}
                          onChange={(e) => setNewHeroTitle({ ...newHeroTitle, ko: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t({ ko: "제목 (영어)", en: "Title (English)" })}</Label>
                        <Input
                          value={newHeroTitle.en}
                          onChange={(e) => setNewHeroTitle({ ...newHeroTitle, en: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t({ ko: "설명 (한국어)", en: "Description (Korean)" })}</Label>
                        <Textarea
                          value={newHeroDesc.ko}
                          onChange={(e) => setNewHeroDesc({ ...newHeroDesc, ko: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t({ ko: "설명 (영어)", en: "Description (English)" })}</Label>
                        <Textarea
                          value={newHeroDesc.en}
                          onChange={(e) => setNewHeroDesc({ ...newHeroDesc, en: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddHero} className="w-fit">
                      <Plus className="mr-2 size-4" />
                      {t({ ko: "추가", en: "Add" })}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">
                    {t({ ko: "현재 이미지", en: "Current Images" })} ({data.heroArtworks.length})
                  </h4>
                  {data.heroArtworks.map((artwork) => (
                    <div
                      key={artwork.id}
                      className="flex items-center gap-4 rounded-lg border border-border bg-card p-3"
                    >
                      <img
                        src={artwork.imageUrl}
                        alt={t(artwork.title)}
                        className="size-16 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{t(artwork.title)}</div>
                        <div className="text-sm text-muted-foreground">
                          {t(artwork.description)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveHero(artwork.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>{t({ ko: "프로젝트 관리", en: "Project Management" })}</CardTitle>
                <CardDescription>
                  {t({ ko: "갤러리 프로젝트를 추가하거나 삭제합니다.", en: "Add or remove gallery projects." })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-dashed border-border p-4">
                  <h4 className="mb-4 font-medium">
                    {t({ ko: "새 프로젝트 추가", en: "Add New Project" })}
                  </h4>
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t({ ko: "이미지 URL", en: "Image URL" })}</Label>
                        <Input
                          placeholder="https://..."
                          value={newProjectUrl}
                          onChange={(e) => setNewProjectUrl(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t({ ko: "카테고리", en: "Category" })}</Label>
                        <Select value={newProjectCategory} onValueChange={setNewProjectCategory}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Painting">Painting</SelectItem>
                            <SelectItem value="Drawing">Drawing</SelectItem>
                            <SelectItem value="Illustration">Illustration</SelectItem>
                            <SelectItem value="Digital Art">Digital Art</SelectItem>
                            <SelectItem value="Photography">Photography</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t({ ko: "제목 (한국어)", en: "Title (Korean)" })}</Label>
                        <Input
                          value={newProjectTitle.ko}
                          onChange={(e) =>
                            setNewProjectTitle({ ...newProjectTitle, ko: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t({ ko: "제목 (영어)", en: "Title (English)" })}</Label>
                        <Input
                          value={newProjectTitle.en}
                          onChange={(e) =>
                            setNewProjectTitle({ ...newProjectTitle, en: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t({ ko: "설명 (한국어)", en: "Description (Korean)" })}</Label>
                        <Textarea
                          value={newProjectDesc.ko}
                          onChange={(e) =>
                            setNewProjectDesc({ ...newProjectDesc, ko: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t({ ko: "설명 (영어)", en: "Description (English)" })}</Label>
                        <Textarea
                          value={newProjectDesc.en}
                          onChange={(e) =>
                            setNewProjectDesc({ ...newProjectDesc, en: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddProject} className="w-fit">
                      <Plus className="mr-2 size-4" />
                      {t({ ko: "추가", en: "Add" })}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">
                    {t({ ko: "현재 프로젝트", en: "Current Projects" })} ({data.projects.length})
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                      >
                        <img
                          src={project.imageUrl}
                          alt={t(project.title)}
                          className="size-12 rounded-md object-cover"
                        />
                        <div className="flex-1 truncate">
                          <div className="truncate font-medium">{t(project.title)}</div>
                          <div className="text-xs text-muted-foreground">{project.category}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveProject(project.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notices">
            <Card>
              <CardHeader>
                <CardTitle>{t({ ko: "공지사항 관리", en: "Notice Management" })}</CardTitle>
                <CardDescription>
                  {t({ ko: "공지사항을 추가하거나 삭제합니다.", en: "Add or remove announcements." })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-dashed border-border p-4">
                  <h4 className="mb-4 font-medium">
                    {t({ ko: "새 공지 추가", en: "Add New Notice" })}
                  </h4>
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t({ ko: "제목 (한국어)", en: "Title (Korean)" })}</Label>
                        <Input
                          value={newNoticeTitle.ko}
                          onChange={(e) =>
                            setNewNoticeTitle({ ...newNoticeTitle, ko: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t({ ko: "제목 (영어)", en: "Title (English)" })}</Label>
                        <Input
                          value={newNoticeTitle.en}
                          onChange={(e) =>
                            setNewNoticeTitle({ ...newNoticeTitle, en: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t({ ko: "내용 (한국어)", en: "Content (Korean)" })}</Label>
                        <Textarea
                          value={newNoticeContent.ko}
                          onChange={(e) =>
                            setNewNoticeContent({ ...newNoticeContent, ko: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t({ ko: "내용 (영어)", en: "Content (English)" })}</Label>
                        <Textarea
                          value={newNoticeContent.en}
                          onChange={(e) =>
                            setNewNoticeContent({ ...newNoticeContent, en: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddNotice} className="w-fit">
                      <Plus className="mr-2 size-4" />
                      {t({ ko: "추가", en: "Add" })}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">
                    {t({ ko: "현재 공지", en: "Current Notices" })} ({data.notices.length})
                  </h4>
                  {data.notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="flex items-start gap-4 rounded-lg border border-border bg-card p-3"
                    >
                      <Bell className="mt-1 size-5 shrink-0 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{t(notice.title)}</div>
                        <div className="text-sm text-muted-foreground">{notice.date}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveNotice(notice.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>{t({ ko: "테마 색상", en: "Theme Color" })}</CardTitle>
                <CardDescription>
                  {t({
                    ko: "이벤트나 시즌에 맞게 웹사이트 테마 색상을 변경합니다.",
                    en: "Change the website theme color for different events or seasons.",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {themeColors.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => updateData({ themeColor: theme.value })}
                      className={cn(
                        "group flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all",
                        data.themeColor === theme.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div
                        className={cn(
                          "size-12 rounded-full transition-transform group-hover:scale-110",
                          theme.color
                        )}
                      />
                      <span className="text-sm font-medium">{t(theme.label)}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bgm">
            <Card>
              <CardHeader>
                <CardTitle>{t({ ko: "배경 음악 관리", en: "BGM Management" })}</CardTitle>
                <CardDescription>
                  {t({ ko: "배경 음악 트랙을 관리합니다.", en: "Manage background music tracks." })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-dashed border-border p-4">
                  <h4 className="mb-4 font-medium">
                    {t({ ko: "새 트랙 추가", en: "Add New Track" })}
                  </h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>{t({ ko: "트랙 이름", en: "Track Name" })}</Label>
                      <Input
                        value={newBgmName}
                        onChange={(e) => setNewBgmName(e.target.value)}
                        placeholder="Peaceful Morning"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t({ ko: "아티스트", en: "Artist" })}</Label>
                      <Input
                        value={newBgmArtist}
                        onChange={(e) => setNewBgmArtist(e.target.value)}
                        placeholder="Ambient Sounds"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddBgm} className="w-full">
                        <Plus className="mr-2 size-4" />
                        {t({ ko: "추가", en: "Add" })}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">
                    {t({ ko: "현재 트랙", en: "Current Tracks" })} ({data.bgmTracks.length})
                  </h4>
                  {data.bgmTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={cn(
                        "flex items-center gap-4 rounded-lg border border-border bg-card p-3",
                        index === data.currentTrackIndex && "border-primary bg-primary/5"
                      )}
                    >
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        <Music className="size-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{track.name}</div>
                        <div className="text-sm text-muted-foreground">{track.artist}</div>
                      </div>
                      {index === data.currentTrackIndex && (
                        <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                          {t({ ko: "재생 중", en: "Playing" })}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveBgm(track.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

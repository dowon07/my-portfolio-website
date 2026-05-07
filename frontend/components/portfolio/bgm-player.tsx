"use client"

import { useState } from "react"
import { usePortfolio } from "@/context/portfolio-context"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BGMPlayer() {
  const { data, updateData } = usePortfolio()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const currentTrack = data.bgmTracks[data.currentTrackIndex] || data.bgmTracks[0]

  const nextTrack = () => {
    const nextIndex = (data.currentTrackIndex + 1) % data.bgmTracks.length
    updateData({ currentTrackIndex: nextIndex })
  }

  const prevTrack = () => {
    const prevIndex = (data.currentTrackIndex - 1 + data.bgmTracks.length) % data.bgmTracks.length
    updateData({ currentTrackIndex: prevIndex })
  }

  if (!currentTrack) return null

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 shadow-sm backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        className="size-7 rounded-full"
        onClick={prevTrack}
      >
        <SkipBack className="size-3.5" />
        <span className="sr-only">Previous track</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "size-8 rounded-full",
          isPlaying && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
        )}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4 translate-x-0.5" />
        )}
        <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="size-7 rounded-full"
        onClick={nextTrack}
      >
        <SkipForward className="size-3.5" />
        <span className="sr-only">Next track</span>
      </Button>

      <div className="hidden w-28 flex-col truncate px-2 sm:flex">
        <span className="truncate text-xs font-medium text-foreground">
          {currentTrack.name}
        </span>
        <span className="truncate text-[10px] text-muted-foreground">
          {currentTrack.artist}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="size-7 rounded-full"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? (
          <VolumeX className="size-3.5" />
        ) : (
          <Volume2 className="size-3.5" />
        )}
        <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
      </Button>

      {currentTrack.url && (
        <audio
          src={currentTrack.url}
          autoPlay={isPlaying}
          muted={isMuted}
          onEnded={nextTrack}
          className="hidden"
        />
      )}
    </div>
  )
}

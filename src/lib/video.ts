export function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export function getThumbnailUrl(videoUrl: string, platform: string | null | undefined): string | null {
  if (platform === 'youtube') {
    const id = getYouTubeId(videoUrl)
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
  }
  return null
}

export function getEmbedUrl(videoUrl: string, platform: string | null | undefined): string {
  if (platform === 'youtube') {
    const match = videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : videoUrl
  }
  if (platform === 'vimeo') {
    const match = videoUrl.match(/vimeo\.com\/(\d+)/)
    return match ? `https://player.vimeo.com/video/${match[1]}` : videoUrl
  }
  return videoUrl
}

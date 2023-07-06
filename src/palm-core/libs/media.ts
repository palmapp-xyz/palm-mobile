function supportsVideoType(mimeType?: string): boolean {
  if (!mimeType || !mimeType.startsWith('video/')) {
    return false
  }

  return true
}

export function shouldRenderVideoTag(mimeType?: string): boolean {
  return !!supportsVideoType(mimeType)
}

function supportsAudioType(mimeType?: string): boolean {
  if (!mimeType || !mimeType.startsWith('audio/')) {
    return false
  }

  return true
}

export function shouldRenderAudioTag(mimeType?: string): boolean {
  return !!supportsAudioType(mimeType)
}

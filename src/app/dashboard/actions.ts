"use server"

import { api } from "~/trpc/server"


export const getSignedURL = async (fileType: string, fileSize: number, checksum: string) => {
  const signedURLResult = await api.media.getSignedURL({
    fileType,
    fileSize,
    checksum,
  })

  return signedURLResult
}

export const createVideoProject = async (videoTitle: string, mediaId: number | undefined) => {
    await api.video.createVideo({ 
      title: videoTitle,
      originalVideoMediaId: mediaId,
    })
}

// ... include computeSHA256 function here ...
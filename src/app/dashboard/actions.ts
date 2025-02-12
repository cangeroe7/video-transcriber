"use server" 

import { auth } from "~/server/auth"
import { env } from "~/env"

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import crypto from "crypto"
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

const s3Client = new S3Client({
  region: env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  }
})

const acceptedTypes = [
  "video/mp4",
]

const maxFileSize = 1024 * 1024 * 20

export async function getSignedURL(type: string, size: number, checksum: string) {
  const session = await auth()
  if (!session) {
    return { failure: "Not authenticated" }
  }

  if (!acceptedTypes.includes(type)) {
    return {failure: "Invalid file type"}
  }

  if (size > maxFileSize) {
    return {failure: "File too large"}
  }

  const putObjctCommand = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: session.user.id,
    }
  })

  const signedURL = await getSignedUrl(s3Client, putObjctCommand, {
    expiresIn: 60,
  })

  
  

  return { success: { url: signedURL } }
}

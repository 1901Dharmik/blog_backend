import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

// Cloudflare R2 client (S3-compatible)
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
})

/**
 * Upload file to R2
 */
export const uploadFileToR2 = async (buffer, key, contentType = 'application/octet-stream', makePublic = false) => {
  try {
    const bucket = makePublic ? process.env.CLOUDFLARE_R2_PUBLIC_BUCKET : process.env.CLOUDFLARE_R2_BUCKET
    
    await r2Client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }))
    
    if (makePublic) {
      return `https://${process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN}/${key}`
    } else {
      const signedUrl = await getSignedUrl(
        r2Client,
        new GetObjectCommand({ Bucket: bucket, Key: key }),
        { expiresIn: 3600 * 12 }
      )
      return signedUrl
    }
  } catch (error) {
    console.error("File upload error:", error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }
}

/**
 * Upload image to R2
 */
export const uploadImageToR2 = async (buffer, key, contentType = 'image/jpeg', makePublic = false) => {
  return uploadFileToR2(buffer, key, contentType, makePublic)
}

/**
 * Upload multiple files to R2
 */
export const uploadMultipleFiles = async (files, makePublic = false) => {
  try {
    const uploadPromises = files.map(({ buffer, key, contentType }) =>
      uploadFileToR2(buffer, key, contentType, makePublic)
    )
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error("Multiple files upload error:", error)
    throw new Error(`Failed to upload multiple files: ${error.message}`)
  }
}

/**
 * Get signed URL from key
 */
export const getSignedUrlFromKey = async (KEY, expiresIn = 3600 * 12) => {
  try {
    if (!KEY) return null
    
    const bucket = process.env.CLOUDFLARE_R2_BUCKET
    const safeKey = typeof KEY === 'string' ? KEY.trim() : String(KEY)
    
    if (!safeKey || safeKey === 'undefined' || safeKey === 'null') {
      return null
    }
    
    const signedUrl = await getSignedUrl(
      r2Client,
      new GetObjectCommand({ Bucket: bucket, Key: safeKey }),
      { expiresIn }
    )
    
    return signedUrl
  } catch (error) {
    console.error("Error generating signed URL:", error?.message || error)
    return null
  }
}

/**
 * Extract key from URL
 */
export const extractKeyFromUrl = (url) => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const mediaIndex = pathname.indexOf('media_')
    
    if (mediaIndex === -1) return null
    
    return pathname.substring(mediaIndex === 0 ? 0 : mediaIndex)
  } catch (error) {
    console.error('Error extracting key from URL:', error)
    return null
  }
}

/**
 * Delete files from R2
 */
export const deleteFromR2 = async (keys) => {
  if (!keys || keys.length === 0) return
  
  try {
    const bucket = process.env.CLOUDFLARE_R2_BUCKET
    
    const deletePromises = keys
      .filter(key => key && key.trim())
      .map(key => 
        r2Client.send(new DeleteObjectCommand({
          Bucket: bucket,
          Key: key.trim()
        }))
      )
    
    await Promise.all(deletePromises)
    console.log('Deleted files:', keys)
  } catch (error) {
    console.error('Error deleting files:', error)
    throw new Error(`Failed to delete files: ${error.message}`)
  }
}

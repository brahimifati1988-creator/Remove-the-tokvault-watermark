# TokVault API

Secure TikTok Downloader API (HD / 4K / MP3)

## Features
- Rate Limit
- API Key protection
- Ready for Render
- No watermark

## Deploy on Render
1. Upload folder
2. Add Environment Variables
3. Start command: `npm start`

## Endpoint
POST /download
Headers:
x-api-key: YOUR_API_KEY
Body:
{
  "url": "https://www.tiktok.com/...",
  "quality": "hd | 4k | mp3"
}
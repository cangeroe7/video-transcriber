# 📝 VidScript: Serverless Video Transcription Pipeline with Remotion Renderer and Full-Stack TypeScript Web App

VidScript is a serverless video processing and transcription pipeline that leverages OpenAI’s Whisper model and **Remotion Renderer** for video rendering. It includes a modern, fully **TypeScript**-based web app built with Next.js, Tailwind CSS, and tRPC, backed by a Neon Postgres database accessed via Drizzle ORM.

This project automates video transcription while providing a seamless user interface to manage and view transcriptions.

---

## 🔧 What It Does

1. **Upload**: Videos uploaded to the `video/` folder in an AWS S3 bucket.
2. **Trigger**: Upload triggers an SQS message.
3. **Process**: AWS Lambda runs to:
   - Render/process videos with **Remotion Renderer** (TypeScript)
   - Transcribe audio using **Whisper AI**
4. **Output**: Transcriptions saved to `transcripts/` in S3.
5. **Web UI**: Users can view and manage videos and transcriptions via a **Next.js** app written in TypeScript.
6. **API**: The app uses **tRPC** for fully type-safe APIs between frontend and backend.
7. **Database**: Video metadata and user info stored in **Neon Postgres** with **Drizzle ORM**, using TypeScript types throughout.
8. **Styling**: Frontend styled with **Tailwind CSS** for fast, responsive design.
9. **Language**: The entire codebase, including Lambda functions, API routes, and frontend, is written in **TypeScript** for robust type safety and maintainability.

---

## 📦 Tech Stack

- **AWS S3, SQS, Lambda** — Serverless storage, queue, and compute
- **Remotion Renderer (TypeScript)** — React-based video rendering framework
- **Whisper AI** — OpenAI’s open-source speech-to-text model
- **Next.js (TypeScript)** — React framework for web UI and SSR
- **tRPC (TypeScript)** — End-to-end type-safe API layer
- **Neon Postgres** — Serverless Postgres hosting
- **Drizzle ORM (TypeScript)** — Type-safe ORM for Postgres
- **Tailwind CSS** — Utility-first CSS framework
- **Node.js** — Runtime for Lambda and backend services
- **FFmpeg** — Video/audio processing tool

---

## 🚀 Features

- Fully serverless video processing and transcription
- Modern React-based TypeScript web app with Next.js and Tailwind
- Type-safe APIs and database access with tRPC and Drizzle ORM
- Serverless Postgres via Neon for scalable data storage
- Video rendering integrated via Remotion Renderer in TypeScript
- Automated transcription with Whisper AI
- Easy deployment and scalability

---

## 🔄 How to Run Locally

> Requires Node.js, Remotion CLI, ffmpeg, and access to Neon Postgres

```bash
# Install dependencies for Lambda and web
npm install

# Run the Next.js web app (TypeScript)
npm run dev

# Render a video locally with Remotion
npx remotion render src/VideoComposition.tsx out/video.mp4

# Run transcription locally (simulate Lambda)
ts-node lambda/transcribe.ts path/to/video.mp4
```
☁️ Deployment Notes
Compile TypeScript Lambda code or use Lambda container images

Package Lambda with Remotion, Whisper, and ffmpeg dependencies

Deploy Next.js app with Vercel, AWS Amplify, or similar platforms

Configure Neon Postgres connection securely via environment variables

Use tRPC for fully type-safe API routes

---

# 🧠 Lessons Learned

- Building a full-stack TypeScript project from Lambda to frontend  
- Integrating React-based Remotion rendering with AI transcription  
- Managing serverless deployments with type safety  
- Efficiently querying Postgres with Drizzle ORM and tRPC  
- Styling with Tailwind CSS for rapid UI development  

---

## 🔗 Links

- [Remotion Renderer](https://www.remotion.dev/)  
- [Whisper GitHub](https://github.com/openai/whisper)  
- [Next.js](https://nextjs.org/)  
- [tRPC](https://trpc.io/)  
- [Neon Postgres](https://neon.tech/)  
- [Drizzle ORM](https://orm.drizzle.team/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [AWS Lambda](https://aws.amazon.com/lambda/)  
- [FFmpeg](https://ffmpeg.org/)  

---

## 📬 Contact

If you want to collaborate or have questions, please reach out!

**Author:** Tom Kraan 

**[LinkedIn](https://www.linkedin.com/in/tom-kraan/)**  

**[Portfolio](https://www.tomkraan.com)**


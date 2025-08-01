# 🧠 Clinical PDF QA + Summarizer — Fullstack RAG App

An end-to-end PDF understanding system built with:

- 🧠 **Backend**: RAG (Retrieval-Augmented Generation) w/ LangChain, Transformers, FAISS
- ⚛️ **Frontend**: Modern React (TypeScript) + Tailwind + Vite/Next.js (client-side)
- ⚙️ **Infrastructure**: Celery for async ingestion, Redis for queueing, Docker-ready

---

## 📦 Features

### ✍️ Upload + Process PDFs
- Upload `.pdf` via drag/drop or button
- Validate + monitor upload progress
- Summary auto-generated after ingestion

### 💬 Chat with your PDF
- Ask questions like: *"What’s the treatment plan?"*
- Backend uses retrieval from FAISS vectorstore
- Model: `deepset/roberta-base-squad2` via HuggingFace pipeline

### 🧾 Summarization
- Extracts & chunks text from PDF
- Uses `Falconsai/text_summarization` for chunk-wise summaries

---

## 🧱 Project Structure

### 🖥 Backend (Python)

```
.
├── query.py               # Answer questions from vectorstore
├── ingest.py              # Chunk text + embed into FAISS
├── summarizer.py          # Summarize entire PDF
├── pdf_reader.py          # PDF → text extraction (PyMuPDF)
├── background_tasks.py    # Celery task for ingestion
├── Dockerfile             # Container setup
```

### 💻 Frontend (React/TS)

```
/components
├── UploadArea.tsx         # Drag-and-drop upload UI
├── SummaryBox.tsx         # Beautiful summary display + copy
├── ChatBox.tsx            # Q&A chat interface
├── ChatInput.tsx          # Send questions
├── PDFPreview.tsx         # Show uploaded PDF metadata
├── ProgressBar.tsx        # Upload progress visual
├── StatusIndicator.tsx    # Status badge (Idle, Uploading, etc.)
├── LoadingSkeleton.tsx    # Skeleton UIs
├── TypingIndicator.tsx    # Bot is typing...
```

---

## 🚀 Quickstart

### Backend

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start Redis
redis-server

# 3. Start Celery
celery -A background_tasks worker --loglevel=info

# 4. Start FastAPI or Flask server (not included here)
uvicorn app:app --reload
```

### Frontend

```bash
npm install
npm run dev
```

---

## 🌐 API Endpoints

| Endpoint          | Method | Description                          |
|------------------|--------|--------------------------------------|
| `/Uploads`        | POST   | Upload a PDF file                    |
| `/summarize`      | GET    | Get summary of uploaded file         |
| `/ask` (optional) | POST   | Ask a question about uploaded PDF    |

---

## ⚙️ Technologies

- 🧠 Transformers: `deepset/roberta-base-squad2`, `Falconsai/text_summarization`
- 🗃️ FAISS vectorstore + LangChain retrievers
- 🐇 Celery + Redis for background ingestion
- 🧩 Tailwind CSS + shadcn/ui for frontend polish

---

## 📌 Notes

- All summaries and vectorstores are cached locally (`uploads/` + `vectorstores/`)
- PDFs are chunked via `RecursiveCharacterTextSplitter`
- Chat and summarization both rely on existing `.txt` if available for speed

---

## 🙌 Credits

Built with ❤️ by Ritankar.


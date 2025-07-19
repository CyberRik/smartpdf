from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from rag.query import answer_question_from_faiss
from tasks.background_tasks import ingest_pdf_task
from utils.summarizer import summarize_pdf
from langchain.llms import huggingface_hub
import shutil
from apscheduler.schedulers.background import BackgroundScheduler

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

@app.get("/health")
def read_item():
    return {"msg": "SmartPDF Backend Ready"}

UPLOAD_DIR = Path(__file__).resolve().parent / "uploads"

@app.post("/Uploads")
async def upload_file(file: UploadFile):
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    ingest_pdf_task.delay(str(file_path))
    return {
        "status": "accepted",
        "filename": file.filename,
        "message": "File received, ingestion started in background"
    }

@app.get("/summarize")
def get_summary(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        return {"error": "File not found."}
    try:
        summary = summarize_pdf(file_path)
    except Exception as e:
        return {"error": f"Summarization failed: {str(e)}"}
    return {
        "filename": filename,
        "summary": summary
    }

@app.get("/ask")
def ask_question(q: str):
    """Legacy simple ask endpoint using query parameter `q`."""
    try:
        answer = answer_question_from_faiss(q, db_path="vectorstores/index")
        return {"question": q, "answer": answer}
    except Exception as e:
        return {"error": f"Query failed: {str(e)}"}

@app.post("/chat")
async def chat_with_pdf(
    question: str = Form(...),
    file: UploadFile = File(None),
):
    """Chat endpoint used by the React frontend (multipart/form-data).
    Currently the PDF `file` is optional because the vectorstore is already
    built during ingestion; only the `question` string is required.
    """
    if not question:
        return {"error": "Question is required"}

    try:
        answer = answer_question_from_faiss(question, db_path="vectorstores/index")
        return {"question": question, "answer": answer}
    except Exception as e:
        return {"error": f"Chat query failed: {str(e)}"}

def cleanup_uploads():
    import os, time
    for f in UPLOAD_DIR.iterdir():
        if time.time() - f.stat().st_mtime > 3600:
            f.unlink()

scheduler = BackgroundScheduler()
scheduler.add_job(cleanup_uploads, "interval", minutes=60)
scheduler.start()
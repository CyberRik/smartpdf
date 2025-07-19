from celery import Celery
from utils.pdf_reader import extract_text_from_pdf
from rag.ingest import ingest_text_to_faiss
from pathlib import Path

celery_app = Celery(
    "summarizer_tasks",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

@celery_app.task
def ingest_pdf_task(file_path: str):
    path = Path(file_path)
    text = extract_text_from_pdf(path)
    ingest_text_to_faiss(text, db_path="vectorstores/index")
    return f"Ingested file: {path.name}"

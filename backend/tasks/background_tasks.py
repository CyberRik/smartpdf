from celery import Celery
from utils.pdf_reader import extract_text_from_pdf
from rag.ingest import ingest_text_to_faiss
from pathlib import Path
import shutil
import os
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings

celery_app = Celery(
    "summarizer_tasks",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

@celery_app.task
def ingest_pdf_task(file_path: str):
    vectorstore_dir = "vectorstores/index"
    uploads_dir = Path(__file__).resolve().parent.parent / "uploads"
    file_path = Path(file_path)
    for f in uploads_dir.iterdir():
        if f != file_path and f.is_file():
            f.unlink()
        if f.suffix == '.txt' and f.stem != file_path.stem:
            f.unlink()
    if os.path.exists(vectorstore_dir):
        shutil.rmtree(vectorstore_dir)
    os.makedirs(vectorstore_dir, exist_ok=True)

    text = extract_text_from_pdf(file_path)
    txt_path = file_path.with_suffix('.txt')
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write(text)
    ingest_text_to_faiss(text, db_path=vectorstore_dir)

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    db = FAISS.load_local(vectorstore_dir, embeddings)
    print("[DEBUG] Number of docs in vectorstore after ingestion:", len(db.docstore._dict))
    return f"Ingested file: {file_path.name} and saved text to: {txt_path.name}"

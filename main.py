from fastapi import FastAPI, File, UploadFile
from pathlib import Path
from utils.pdf_reader import extract_text_from_pdf

app = FastAPI()

@app.get("/")
def read_item():
    return {"msg": "SmartPDF Backend Ready"}

UPLOAD_DIR = Path("uploads")

@app.post("/Uploads")
def upload_file(file: UploadFile):
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_path = UPLOAD_DIR/file.filename
    with file_path.open("wb") as f:
        f.write(file.file.read())
    text = extract_text_from_pdf(file_path)
    return {"status": "success",
            "filename": file.filename, 
            "summary": text[:300] + "..." if len(text) > 300 else text}
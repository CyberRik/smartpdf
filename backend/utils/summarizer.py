from dotenv import load_dotenv
load_dotenv()

from utils.pdf_reader import extract_text_from_pdf
from transformers import pipeline
from pathlib import Path
from langchain.text_splitter import RecursiveCharacterTextSplitter
import torch

summarizer_instance = None

def get_summarizer():
    global summarizer_instance
    if summarizer_instance is None:
        device = 0 if torch.cuda.is_available() else -1
        summarizer_instance = pipeline("summarization", model="Falconsai/text_summarization", device=device)
    return summarizer_instance

def summarize_pdf(pdf_path: str) -> str:
    txt_path = Path(pdf_path).with_suffix('.txt')

    if txt_path.exists() and txt_path.stat().st_mtime >= Path(pdf_path).stat().st_mtime:
        text = txt_path.read_text(encoding='utf-8')
    else:
        text = extract_text_from_pdf(pdf_path)
        txt_path.write_text(text, encoding='utf-8')

    if not text.strip():
        return "No text found in PDF."

    summarizer = get_summarizer()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
    chunks = text_splitter.split_text(text)

    summaries = []
    for chunk in chunks:
        try:
            input_length = len(chunk.split())
            output_length = max(30, int(input_length * 0.5))
            total_max_length = input_length + output_length
            # summary = summarizer(
            #     chunk,
            #     max_new_tokens=output_length,
            #     do_sample=False
            # )[0]['summary_text']
            summary = summarizer(
                chunk,
                max_length = total_max_length,
                do_sample=False
            )[0]['summary_text']
        except Exception as e:
            summary = f"[Error summarizing chunk: {e}]"
        summaries.append(summary)

    return '\n'.join(summaries)

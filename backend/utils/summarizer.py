from utils.pdf_reader import extract_text_from_pdf
from langchain.llms import huggingface_hub

def summarize_pdf(pdf_path: str, max_length: int = 300) -> str:
    text = extract_text_from_pdf(pdf_path)

    if not text.strip():
        return "No text found in PDF."

    llm = huggingface_hub.HuggingFaceHub(
        repo_id="google/flan-t5-base",
        model_kwargs={"temperature": 0.3, "max_length": max_length}
    )

    prompt = f"summarize: {text}"

    summary = llm(prompt)

    return summary

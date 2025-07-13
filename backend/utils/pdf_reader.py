def extract_text_from_pdf(pdf_path: str) -> str:
    import fitz  

    text = ""
    with fitz.open(pdf_path) as pdf:
        for page in pdf:
            text += page.get_text()
    return text


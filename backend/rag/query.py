from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from transformers import pipeline
import os
from dotenv import load_dotenv

load_dotenv()

def answer_question_from_faiss(question: str, db_path: str = "vectorstores/index") -> str:
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    db = FAISS.load_local(db_path, embeddings, allow_dangerous_deserialization=True)
    retriever = db.as_retriever(search_kwargs={"k": 3})
    docs = retriever.get_relevant_documents(question)
    print("[DEBUG] Retrieved docs:", [doc.page_content for doc in docs])

    if not docs:
        return "No relevant content found in the PDF."

    context = " ".join([doc.page_content for doc in docs])
    qa_pipeline = pipeline("question-answering", model="deepset/roberta-base-squad2")
    result = qa_pipeline(question=question, context=context)
    answer = result["answer"]
    # If the model says 'no answer', return a hepful message
    if not answer or answer.lower() in ["", "n/a", "no answer", "empty"]:
        return "No relevant answer found in the PDF."
    return answer

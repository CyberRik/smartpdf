from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import huggingface_hub
from langchain.chains import retrieval_qa

import os
from dotenv import load_dotenv

load_dotenv()

def answer_question_from_faiss(question: str, db_path: str = "vectorstores/index") -> str:
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    db = FAISS.load_local(db_path, embeddings)

    retreiver = db.as_retreiver(search_kwargs={"k": 5})

    llm = huggingface_hub.HuggingFaceHub(
        repo_id="google/flan-t5-base",
        model_kwargs={"temperature": 0.3, "max_length": 512}
    )

    qa_chain = retrieval_qa.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retreiver,
    )

    result = qa_chain.run(question)
    return result

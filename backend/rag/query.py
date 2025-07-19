from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import HuggingFacePipeline
from langchain.chains import RetrievalQA
from transformers import pipeline
from dotenv import load_dotenv

load_dotenv()

def answer_question_from_faiss(question: str, db_path: str = "vectorstores/index") -> str:
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    db = FAISS.load_local(db_path, embeddings)
    retriever = db.as_retriever(search_kwargs={"k": 5})

    qa_model = pipeline(
        "question-answering",
        model="deepset/roberta-base-squad2",
        tokenizer="deepset/roberta-base-squad2"
    )
    llm = HuggingFacePipeline(pipeline=qa_model)

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=False,
    )

    return qa_chain.run(question)

from fastapi import APIRouter, UploadFile, File
from functions.functions import (normalize_text, indexing_one_hot, make_pairs, frequencies)
from functions.train_skip_gram import train_skipgram

router = APIRouter()

@router.get("/")
def read_root():
    return {"message": "¡Hello, FastAPI!"}

@router.post("/check")
async def check_file(file: UploadFile = File(...)):
    content = await file.read()

    with open(file.filename, "wb") as f:
        f.write(content)
    text_file = file.filename
    stopwords_file = "stopwords-es.txt"
    
    final_tokens = normalize_text(text_file, stopwords_file)
    
    vocabulary, word_to_index, one_hot_map = indexing_one_hot(final_tokens)
    pairs,  user_pairs = make_pairs(final_tokens, word_to_index, ventana=2)

    tf_idf = frequencies(text_file,stopwords_file, list(set(final_tokens)))

    return({"word_to_index":word_to_index,"one_hot":one_hot_map, "pairs":user_pairs,"idf":tf_idf})
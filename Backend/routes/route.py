from fastapi import APIRouter, UploadFile, File, Query, Form
from functions.functions import (normalize_text, indexing_one_hot, make_pairs, frequencies)
from functions.train_skip_gram import softmax, train_skipgram
import json
import os
import numpy as np
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
    pairs,  user_pairs = make_pairs(vocabulary, word_to_index, ventana=2)

    tf_idf = frequencies(text_file,stopwords_file, list(set(final_tokens)))
    os.remove(file.filename)
    return({"word_to_index":word_to_index,"one_hot":one_hot_map, "pairs":user_pairs,"idf":tf_idf, "tokens":vocabulary})

@router.post("/lookup")
async def lookup(all_tokens: str = Form(...), token_index: int = Form(...),file: UploadFile = File(...)):
    all_tokens = json.loads(all_tokens)
    input_weights = np.load(file.file)
    try:
        neighbors = 4
        #Eliminate neighbors if necesary
        if token_index - 2 < 0:
            neighbors -= abs(token_index - 2)
        if token_index + 2 > len(all_tokens):
            neighbors -= ((token_index +2) - len(all_tokens))

        #Check cosine_similarities
        cosine_similarities = np.array([])
        vector_a = input_weights[token_index]
        for i in range(len(all_tokens)):
            if i == token_index: 
                cosine_similarities = np.append(cosine_similarities,np.float64(0.0))
                continue
            vector_b = input_weights[i]
            similarity = np.dot(vector_a,vector_b) / (np.linalg.norm(vector_a) * np.linalg.norm(vector_b))
            cosine_similarities = np.append(cosine_similarities,similarity)

        sorted = np.sort(cosine_similarities)
        indices = []
        for i in range(len(sorted),len(sorted)-neighbors,-1):
            indices.append(int(np.where(cosine_similarities == sorted[i-1])[0][0]))
        return({"indeces": indices, "success":True})
    
    except Exception:
        return({"indeces": None, "success":False})
    
    
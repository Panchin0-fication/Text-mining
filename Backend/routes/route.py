from fastapi import APIRouter, UploadFile, File, Query, Form
from functions.functions import (normalize_text, indexing_one_hot, make_pairs, frequencies)
from functions.train_skip_gram import softmax, train_skipgram
from models.model import LookupRequest
import os
import numpy as np
from typing import Annotated
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
    os.remove(file.filename)
    #train_skipgram(word_to_index, pairs, final_tokens)
    return({"word_to_index":word_to_index,"one_hot":one_hot_map, "pairs":user_pairs,"idf":tf_idf, "tokens":final_tokens})

@router.post("/lookup")
async def lookup(data: LookupRequest):
    input_weights = np.load('PEnt.npy')
    output_weights = np.load('PSal.npy')
    one_hot_token = np.array(data.one_hot_token).reshape(1,-1)

    probs = np.dot(one_hot_token, input_weights)
    probs = softmax(np.dot(probs, output_weights))
    probs = list(probs)

    return({"fount_word": data.all_tokens[list(probs[0]).index(max(probs[0]))]})
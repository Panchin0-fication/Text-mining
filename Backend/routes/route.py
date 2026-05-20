from fastapi import APIRouter, UploadFile, File
import string
import unicodedata
import math
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

    def eliminate_accentuation(text):
        text = unicodedata.normalize('NFD', text)
        return ''.join(c for c in text if unicodedata.category(c) != 'Mn')

    def normalize_text(text_file, stopwords_file, raw_text=""):
        corpus = ""

        if(raw_text == ""):
            with open(text_file, "r", encoding="utf-8") as f:
                corpus = f.read()
        else:
            corpus = raw_text
        with open(stopwords_file, "r", encoding="utf-8") as f:
            stop_words = {eliminate_accentuation(line.strip().lower()) for line in f}

        # Normalizacion
        corpus = corpus.lower()
        corpus = eliminate_accentuation(corpus)
        tabla_puntuacion = str.maketrans('', '', string.punctuation + '¡¿')
        corpus = corpus.translate(tabla_puntuacion)
        
        tokens_iniciales = corpus.split()
        
        # Remove Stop-words
        tokens_finales = [t for t in tokens_iniciales if t not in stop_words]
        
        return tokens_finales

    def indexing_one_hot(tokens):

        vocabulario = list(set(tokens))
        vocab_size = len(vocabulario)

        word_to_index = {word: i for i, word in enumerate(vocabulario)}
        
        one_hot_encoding = {}
        for word in vocabulario:
            vector = [0] * vocab_size
            vector[word_to_index[word]] = 1
            one_hot_encoding[word] = vector
            
        return vocabulario, word_to_index, one_hot_encoding

    def make_pairs(tokens, word_to_index, ventana=2):
        #pairs = []
        pairs = []
        user_pairs = []
        n = len(tokens)
        for i in range(n):
            start = max(0, i - ventana)
            end = min(n, i + ventana + 1)
            
            for j in range(start, end):
                if i != j:
                    user_pairs.append((tokens[i], tokens[j]))
                    pairs.append((word_to_index[tokens[i]],word_to_index[tokens[j]]))
        return pairs, user_pairs

    def frequencies(text_file, set_all_tokens):

        with open(text_file, "r", encoding="utf-8") as f:
            corpus = f.read()

        #Divide Corpus
        divided_corpus = corpus.split("\n\n")

        tokenized_paragraphs = []
        term_frecuency = []
        for paragraph in divided_corpus:
            tokens_record = {}
            tokenized_paragraph = normalize_text(text_file, stopwords_file, paragraph)
            tokenized_paragraphs.append(tokenized_paragraph)
            set_tokens = set(tokenized_paragraph)
            # Get all the ocurrencies
            for token in set_tokens:
                count_token = tokenized_paragraph.count(token)
                tokens_record[token] = count_token / len(tokenized_paragraph)
            
            term_frecuency.append(tokens_record)
        
        document_frecuency = {}
        for token in set_all_tokens:
            count_j = 0
            for i in range(len(tokenized_paragraphs)):
                if tokenized_paragraphs[i].count(token) >= 1:
                    count_j += 1
            document_frecuency[token] = math.log(len(tokenized_paragraphs)/count_j)
                
        tf_idf = []
        for i in range(len(term_frecuency)):
            an_idf = {}
            for token in term_frecuency[i]:
                an_idf[token] = term_frecuency[i][token] * document_frecuency[token]
            tf_idf.append(an_idf)

        return tf_idf

    text_file = file.filename
    stopwords_file = "stopwords-es.txt"
    
    final_tokens = normalize_text(text_file, stopwords_file)
    
    vocabulary, word_to_index, one_hot_map = indexing_one_hot(final_tokens)
    print("Indices",word_to_index)
    pairs,  user_pairs = make_pairs(final_tokens, word_to_index, ventana=2)

    tf_idf = frequencies(text_file, list(set(final_tokens)))

    train_skipgram(word_to_index, pairs, final_tokens)

    return({"word_to_index":word_to_index,"one_hot":one_hot_map, "pairs":user_pairs,"idf":tf_idf})
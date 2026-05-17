import string
import unicodedata

def eliminar_acentos(texto):
    # Convierte a forma descompuesta (NFD) y filtra las marcas de acento (Mn)
    texto = unicodedata.normalize('NFD', texto)
    return ''.join(c for c in texto if unicodedata.category(c) != 'Mn')

def normalizar_texto(archivo_texto, archivo_stopwords, raw_text=""):
    # Leer archivos
    corpus = ""

    if(raw_text == ""):
        with open(archivo_texto, "r", encoding="utf-8") as f:
            corpus = f.read()
    else:
        corpus = raw_text
    with open(archivo_stopwords, "r", encoding="utf-8") as f:
        stop_words = {eliminar_acentos(line.strip().lower()) for line in f}

    # Normalizacion
    corpus = corpus.lower()
    corpus = eliminar_acentos(corpus)
    tabla_puntuacion = str.maketrans('', '', string.punctuation + '¡¿')
    corpus = corpus.translate(tabla_puntuacion)
    
    tokens_iniciales = corpus.split()
    
    # Quitar Stop-words
    tokens_finales = [t for t in tokens_iniciales if t not in stop_words]
    
    return tokens_finales

def indexacion_one_hot(tokens):

    vocabulario = list(set(tokens))
    vocab_size = len(vocabulario)

    word_to_index = {word: i for i, word in enumerate(vocabulario)}
    
    one_hot_encoding = {}
    for word in vocabulario:
        vector = [0] * vocab_size
        vector[word_to_index[word]] = 1
        one_hot_encoding[word] = vector
        
    return vocabulario, word_to_index, one_hot_encoding

def conformar_parejas(tokens, ventana=2):
    parejas = []
    n = len(tokens)
    for i in range(n):
        inicio = max(0, i - ventana)
        fin = min(n, i + ventana + 1)
        
        for j in range(inicio, fin):
            if i != j:
                parejas.append((tokens[i], tokens[j]))
    return parejas

def frecuencias(archivo_texto):

    with open(archivo_texto, "r", encoding="utf-8") as f:
        corpus = f.read()

    print("QUE",corpus)

    #Dividir texto
    corpus_dividido = corpus.split("\n\n")

    parrafos_tokensados = []
    term_frecuency = []
    for parrafo in corpus_dividido:
        ocurrencias = {}
        parrafo_tokenizado = normalizar_texto(archivo_texto, archivo_stopwords, parrafo)
        parrafos_tokensados.append(parrafo_tokenizado)
        set_tokens = set(parrafo_tokenizado)
        # Get all the ocurrencies
        for token in set_tokens:
            oocurrencias = parrafo_tokenizado.count(token)
            ocurrencias[token] = oocurrencias / len(parrafo_tokenizado)
        
        term_frecuency.append(ocurrencias)
            

    print("Estos son los parrafos tokenizados",parrafos_tokensados,len(parrafos_tokensados))
    print("Estas son las ocurrencias por parrafos", term_frecuency)
    todos_idf = []

    #for i in range(len(parrafos_tokensados)):

        



archivo_texto = "texto.txt"
archivo_stopwords = "stopwords-es.txt"

tokens_finales = normalizar_texto(archivo_texto, archivo_stopwords)



vocabulario, word_to_index, one_hot_map = indexacion_one_hot(tokens_finales)

parejas = conformar_parejas(tokens_finales, ventana=2)

print("-" * 30)
print("1.- CONJUNTO DE TOKENS FINALES (Posición final):")
print("-" * 30)
print(tokens_finales)
print(f"\nTotal de tokens: {len(tokens_finales)}")

print("\n" + "-" * 30)
print("INDEXACIÓN (Mapeo Vocabulario -> Índice):")
print("-" * 30)
for word, idx in word_to_index.items():
    print(f"{word}: {idx}")

print("\n" + "-" * 30)
print("2.- PAREJAS DE TOKENS (Ventana tamaño 2):")
print("-" * 30)
for p in parejas:
    print(p)
print(f"\nTotal de parejas: {len(parejas)}")

frecuencias(archivo_texto)

##print("tempranito",otro)

"""
  #Count the ocurrencies
    occurencies = {}
    for word in tokens:
        occurencies[word] = 1 if occurencies.get(word) == None else occurencies[word] + 1;
    #Get frecuencies
    frecuencies = {}
    for word in occurencies:
        frecuencies[word] = occurencies[word]/len(tokens)

    print("OCURRENCIAS", occurencies)
    print("FRECUENCIAS", frecuencies)"""
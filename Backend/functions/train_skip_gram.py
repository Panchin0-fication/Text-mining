import numpy as np

window_size = 2
embedding_size = 300
learning_rate = 0.01
epochs = 10000

def initialize_weights(rows, cols):
    return np.random.random((rows, cols))

def softmax(value):
    exp_values = np.exp(value - np.max(value))  # Para estabilidad numérica
    return exp_values / np.sum(exp_values)

def train_skipgram(Indice, Pairs, tokens):
    vocab_size = len(Indice)  # Corregido: usar Indice directamente
    
    # Intentar cargar pesos existentes
    try:
        input_weights = np.loadtxt("PEnt.txt")
        output_weights = np.loadtxt("PSal.txt")
        print("Cargando pesos existentes...")
    except Exception:
        print("Inicializando nuevos pesos...")
        input_weights = initialize_weights(len(tokens), embedding_size)
        output_weights = initialize_weights(embedding_size, len(tokens))
    
    target_words, context_words = zip(*Pairs)
    
    for epoch in range(epochs):
        total_loss = 0
        
        for target_word, context_word in zip(target_words, context_words):
            # Forward pass
            input_vector = input_weights[target_word]  # (embedding_size,)
            output_vector = np.dot(output_weights.T, input_vector)  # (vocab_size,)
            output_probs = softmax(output_vector)
            
            # Calculate gradient
            error = output_probs.copy()
            error[context_word] -= 1  # error es (vocab_size,)
            
            # Backpropagation - CORREGIDO
            input_grad = np.dot(output_weights, error)  # (embedding_size,)
            output_grad = np.outer(input_vector, error)  # (embedding_size, vocab_size)
            
            # Gradient descent update
            input_weights[target_word] -= learning_rate * input_grad
            output_weights -= learning_rate * output_grad
            
            # Calculate loss
            total_loss -= np.log(abs(output_probs[context_word]) + 1e-9)
        
        if epoch % 10 == 0:
            print(f"Epoch {epoch + 1}/{epochs}, Loss: {total_loss / len(Pairs)}")
    
    # Guardar pesos
    np.savetxt('PEnt.txt', input_weights)
    np.savetxt('PSal.txt', output_weights)
    
    return input_weights, output_weights
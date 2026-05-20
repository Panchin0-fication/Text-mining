import numpy as np
window_size = 2
embedding_size = 300
learning_rate = 0.01
epochs = 10000
def initialize_weights(rows, cols):
    return np.random.random((rows,cols))

def softmax(value):
    return np.exp(value) / np.sum(np.exp(value))

def train_skipgram(Indice, Pairs, tokens):
    word_index = Indice
    vocab_size = len(word_index)
    #input_weights, output_weights = initialize_weights(vocab_size, embedding_size)
    input_weights = initialize_weights(len(tokens), embedding_size)
    output_weights = initialize_weights(embedding_size, len(tokens))
    for epoch in range(epochs):
        total_loss = 0
        target_words, context_words = zip(*Pairs)
        for target_word, context_word in zip(target_words, context_words):
            target_index = target_word
            context_index = context_word
        # Forward pass
        input_vector = input_weights[target_word]
        output_vector = np.dot(input_vector, output_weights)
        output_probs = softmax(output_vector)

        # Calculate gradient
        error = output_probs
        error[context_word] -= 1
        # Backpropagation
        input_grad = np.dot(error,input_weights)
        output_grad = np.outer(input_vector, error)
        # Gradient descent update
        input_weights[target_word] -= learning_rate * input_grad
        output_weights -= learning_rate * output_grad
        # Calculate loss

        total_loss += -np.log(output_probs[target_word])
        vrt=1
        if (epoch%1000 == 0) :
            print(f"Epoch {epoch + 1}/{epochs}, Loss: {total_loss / vocab_size}")

    np.savetxt('PEnt.txt',input_weights)
    np.savetxt('PSal.txt', output_weights)
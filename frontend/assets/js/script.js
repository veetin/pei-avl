// Variável para armazenar a opção selecionada
let selectedAnswerOption = null;

// Elementos do DOM
const feedbackModal = document.getElementById('feedback-modal');
const feedbackMessage = document.getElementById('feedback-message');
const submitButton = document.getElementById('submit-button');

/**
 * Função para selecionar uma resposta.
 * @param {HTMLElement} optionElement - O elemento da opção clicada.
 * @param {string} optionValue - O valor da opção (ex: 'A', 'B').
 */
function selectAnswer(optionElement, optionValue) {
    // Remove a classe 'selected' de todas as outras opções
    const allOptions = document.querySelectorAll('.answer-option');
    allOptions.forEach(option => {
        option.classList.remove('selected');
    });

    // Adiciona a classe 'selected' à opção clicada
    optionElement.classList.add('selected');
    selectedAnswerOption = optionValue;

    // Log para debug (pode ser removido)
    console.log('Opção selecionada:', selectedAnswerOption);
}

/**
 * Função para exibir o modal de feedback.
 * @param {string} message - A mensagem a ser exibida.
 * @param {boolean} isSuccess - True se for mensagem de sucesso, false para erro.
 */
function showFeedback(message, isSuccess = true) {
    feedbackMessage.textContent = message;
    // As cores de sucesso/erro podem ser definidas diretamente ou via classes CSS
    feedbackMessage.style.color = isSuccess ? 'var(--primary-accent-color)' : '#E53E3E'; // Exemplo de cor de erro
    feedbackModal.style.display = 'flex'; 
}

/**
 * Função para fechar o modal de feedback.
 */
function closeModal() {
    feedbackModal.style.display = 'none';
}

// Event listener para o botão de confirmar resposta
submitButton.addEventListener('click', () => {
    if (selectedAnswerOption) {
        // Simula o envio para o backend e feedback
        showFeedback(`Resposta "${selectedAnswerOption}" confirmada! (Simulação)`);
        
        // Lógica para carregar a próxima questão ou finalizar a avaliação viria aqui.
        // Por exemplo:
        // selectedAnswerOption = null; // Reseta a seleção
        // carregarProximaQuestao();
    } else {
        showFeedback('Por favor, selecione uma opção antes de confirmar.', false);
    }
});

// Fechar o modal se o usuário clicar fora do conteúdo do modal
window.onclick = function(event) {
    if (event.target == feedbackModal) {
        closeModal();
    }
}

// Adiciona listeners para os vídeos das opções de resposta (play on hover)
document.addEventListener('DOMContentLoaded', () => {
    const answerVideos = document.querySelectorAll('.answer-media video');

    answerVideos.forEach(video => {
        video.pause();
        video.currentTime = 0;

        video.addEventListener('mouseover', () => {
            video.play().catch(error => console.error("Erro ao tentar tocar o vídeo:", error));
        });

        video.addEventListener('mouseout', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
});
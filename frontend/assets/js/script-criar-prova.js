document.addEventListener('DOMContentLoaded', () => {
    const addQuestionBtn = document.getElementById('add-question-btn');
    const questionList = document.getElementById('question-list');
    const questionTemplate = document.getElementById('question-template');
    let questionCounter = 0;

    addQuestionBtn.addEventListener('click', () => {
        questionCounter++;
        
        // Clona o conteúdo do template
        const newQuestion = questionTemplate.content.cloneNode(true);
        const questionCard = newQuestion.querySelector('.question-editor-card');
        
        // Atualiza o título da nova questão
        questionCard.querySelector('.question-card-title').textContent = `Questão ${questionCounter}`;
        
        // Garante que os botões de rádio para resposta correta tenham um nome único
        const radioName = `correct-answer-${questionCounter}`;
        questionCard.querySelectorAll('.correct-answer-radio').forEach(radio => {
            radio.name = radioName;
        });

        // Adiciona evento para o botão de remover
        const removeBtn = questionCard.querySelector('.remove-question-btn');
        removeBtn.addEventListener('click', () => {
            questionCard.remove();
            // Re-numera as questões restantes para manter a ordem
            updateQuestionNumbers();
        });

        // Adiciona evento para o seletor de tipo de questão
        const questionTypeSelect = questionCard.querySelector('.question-type-select');
        const answersEditor = questionCard.querySelector('.answers-editor');
        
        questionTypeSelect.addEventListener('change', (event) => {
            if (event.target.value === 'multipla-escolha') {
                answersEditor.style.display = 'block';
            } else {
                answersEditor.style.display = 'none';
            }
        });

        // Adiciona a nova questão à lista
        questionList.appendChild(questionCard);
    });

    function updateQuestionNumbers() {
        const allQuestions = questionList.querySelectorAll('.question-editor-card');
        questionCounter = allQuestions.length; // Atualiza o contador global
        allQuestions.forEach((card, index) => {
            card.querySelector('.question-card-title').textContent = `Questão ${index + 1}`;
            // Atualiza o nome dos rádios para garantir que continuem únicos
            const radioName = `correct-answer-${index + 1}`;
            card.querySelectorAll('.correct-answer-radio').forEach(radio => {
                radio.name = radio_name;
            });
        });
    }

    // Ações Finais (placeholders)
    document.querySelector('.final-actions .skip-btn').addEventListener('click', () => alert('Prova salva como rascunho!'));
    document.querySelector('.final-actions .confirm-btn').addEventListener('click', () => alert('Prova publicada com sucesso!'));
});
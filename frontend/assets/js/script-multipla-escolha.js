let selectedAnswerOption = null;
let timerInterval;

function selectAnswer(optionElement) {
    const allOptions = document.querySelectorAll('.answer-option');
    allOptions.forEach(option => option.classList.remove('selected'));
    optionElement.classList.add('selected');
    selectedAnswerOption = optionElement;
}

function startTimer() {
    let seconds = 0;
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timerElement.textContent = `${mins}:${secs}`;
    }, 1000);
}

function setupActionButtons() {
    document.getElementById('confirm-button')?.addEventListener('click', () => {
        if (!selectedAnswerOption) {
            alert('Por favor, selecione uma alternativa antes de confirmar.');
            return;
        }
        alert('Resposta confirmada! (Avançando para a próxima questão...)');
    });

    document.getElementById('review-button')?.addEventListener('click', () => {
        alert('Questão marcada para revisar depois. (Avançando para a próxima questão...)');
    });

    document.getElementById('skip-button')?.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja pular esta questão sem responder?')) {
            alert('Questão pulada. (Avançando para a próxima questão...)');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    startTimer();
    setupActionButtons();

    const answerVideos = document.querySelectorAll('.answer-media video');
    answerVideos.forEach(video => {
        video.pause();
        video.currentTime = 0;
        video.addEventListener('mouseover', () => video.play().catch(e => console.error(e)));
        video.addEventListener('mouseout', () => { video.pause(); video.currentTime = 0; });
    });
});
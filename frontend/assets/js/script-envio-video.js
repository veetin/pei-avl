let timerInterval;

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

function setupFileUpload() {
    const uploadInput = document.getElementById('video-upload-input');
    const fileNameDisplay = document.getElementById('file-name-display');

    uploadInput?.addEventListener('change', () => {
        if (uploadInput.files.length > 0) {
            fileNameDisplay.textContent = `Arquivo selecionado: ${uploadInput.files[0].name}`;
        } else {
            fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
        }
    });

    document.getElementById('send-video-btn')?.addEventListener('click', () => {
        if (uploadInput.files.length === 0) {
            alert('Por favor, adicione um arquivo de vídeo antes de enviar.');
            return;
        }
        alert(`Enviando o arquivo "${uploadInput.files[0].name}"... (Funcionalidade a ser implementada)`);
    });

    document.getElementById('skip-button')?.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja pular esta questão sem responder?')) {
            alert('Questão pulada. (Avançando para a próxima questão...)');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    startTimer();
    setupFileUpload();
});

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

async function carregarQuestao() {
  const urlParams = new URLSearchParams(window.location.search);
  const provaId = urlParams.get("id");
  const questaoIndex = parseInt(urlParams.get("q")) - 1;

  if (!provaId || isNaN(questaoIndex)) {
    alert("Parâmetros inválidos.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8001/api/avaliacoes/${provaId}`);
    const data = await res.json();
    const pergunta = data.perguntas[questaoIndex];

    if (!pergunta || pergunta.tipo !== "envio-video") {
      alert("Questão inválida ou não é do tipo envio de vídeo.");
      return;
    }

    document.getElementById("info-subject").textContent = data.materia;
    document.getElementById("stats-total").textContent = data.perguntas.length;
    document.getElementById("question-title-counter").textContent =
      `Pergunta ${questaoIndex + 1} de ${data.perguntas.length} (Envio de Vídeo)`;

    const questionVideo = document.querySelector(".question-card video");
    questionVideo.src = `http://localhost:8001${pergunta.pergunta_video_url}`;

  } catch (err) {
    console.error("Erro ao carregar questão:", err);
    alert("Erro ao carregar a questão.");
  }
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
  carregarQuestao();
  setupFileUpload();
});

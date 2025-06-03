let selectedAnswerOption = null;
let timerInterval;

function startTimer() {
  let seconds = parseInt(localStorage.getItem('prova-tempo-segundos')) || 0;
  const timerElement = document.getElementById('timer');
  if (!timerElement) return;

  timerElement.textContent = formatTime(seconds);

  timerInterval = setInterval(() => {
    seconds++;
    localStorage.setItem('prova-tempo-segundos', seconds);
    timerElement.textContent = formatTime(seconds);
  }, 1000);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function renderMultiplaEscolha(pergunta) {
  const container = document.getElementById("answer-options-container");
  container.innerHTML = "";
  const letras = ["A", "B", "C", "D"];

  pergunta.alternativas.forEach((alt, i) => {
    const option = document.createElement("div");
    option.className = "answer-option";
    option.onclick = () => {
      document.querySelectorAll('.answer-option').forEach(o => {
        o.classList.remove('selected');
        const video = o.querySelector("video");
        if (video) {
          const perguntaVideo = document.getElementById("question-video");
          const alturaReferencial = perguntaVideo?.clientHeight || 338;
          video.style.height = alturaReferencial + "px";
        }

      });
      option.classList.add('selected');
      const video = option.querySelector("video");
      if (video) {
        video.style.height = "338px"; // altura igual à altura padrão do vídeo da pergunta
      }
      selectedAnswerOption = option;
    };
    option.innerHTML = `
      <span class="option-letter">${letras[i]}</span>
      <div class="answer-media">
        ${alt.video_url ? `<video muted loop onmouseover="this.play()" onmouseout="this.pause(); this.currentTime = 0;"
               src="http://localhost:8001${alt.video_url}" style="width: 100%; height: 200px; object-fit: cover;"></video>`
        : `<span style="color:#888; display: block; height: 200px; line-height: 200px; text-align: center;">Sem vídeo</span>`}
      </div>`;
    container.appendChild(option);
  });

  document.getElementById("multipla-escolha-container").style.display = "block";
  document.getElementById("envio-video-container").style.display = "none";
}

function renderEnvioVideo() {
  const uploadInput = document.getElementById('video-upload-input');
  const fileNameDisplay = document.getElementById('file-name-display');

  uploadInput.onchange = () => {
    fileNameDisplay.textContent = uploadInput.files.length > 0 ?
      `Arquivo selecionado: ${uploadInput.files[0].name}` : 'Nenhum arquivo selecionado';
  };

  document.getElementById("send-video-btn").onclick = () => {
    if (!uploadInput.files.length) {
      alert("Por favor, selecione um arquivo.");
      return;
    }
    alert(`Enviando vídeo: ${uploadInput.files[0].name}`);
  };

  document.getElementById("multipla-escolha-container").style.display = "none";
  document.getElementById("envio-video-container").style.display = "block";
}

async function carregarQuestao() {
  const params = new URLSearchParams(window.location.search);
  const provaId = params.get("id");
  const questaoIndex = parseInt(params.get("q")) - 1;

  if (!provaId || isNaN(questaoIndex)) {
    alert("Parâmetros inválidos.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8001/api/avaliacoes/${provaId}`);
    const data = await res.json();
    const pergunta = data.perguntas[questaoIndex];

    document.getElementById("info-subject").textContent = data.materia;
    document.getElementById("stats-total").textContent = data.perguntas.length;
    document.getElementById("question-title-counter").textContent =
      `Pergunta ${questaoIndex + 1} de ${data.perguntas.length}`;

    const videoEl = document.getElementById("question-video");
    videoEl.src = `http://localhost:8001${pergunta.pergunta_video_url}`;

    if (pergunta.tipo === "multipla-escolha") {
      document.getElementById("question-title-counter").textContent += " (Múltipla Escolha)";
      renderMultiplaEscolha(pergunta);
    } else if (pergunta.tipo === "envio-video") {
      document.getElementById("question-title-counter").textContent += " (Envio de Vídeo)";
      renderEnvioVideo();
    } else {
      alert("Tipo de questão não suportado.");
    }

    const prevBtn = document.getElementById("prev-question");
    const nextBtn = document.getElementById("next-question");
    prevBtn.href = `?id=${provaId}&q=${questaoIndex}`;
    nextBtn.href = `?id=${provaId}&q=${questaoIndex + 2}`;
    if (questaoIndex <= 0) prevBtn.classList.add("disabled");
    if (questaoIndex >= data.perguntas.length - 1) nextBtn.classList.add("disabled");
  } catch (err) {
    console.error("Erro ao carregar questão:", err);
    alert("Erro ao carregar a questão.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  startTimer();
  carregarQuestao();
});

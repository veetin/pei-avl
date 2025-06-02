document.addEventListener("DOMContentLoaded", () => {
    const addQuestionBtn = document.getElementById("add-question-btn");
    const questionList = document.getElementById("question-list");
    const questionTemplate = document.getElementById("question-template");
    const publicarBtn = document.querySelector(".confirm-btn");
    let questionCounter = 0;

    addQuestionBtn.addEventListener("click", () => {
        questionCounter++;

        const newQuestion = questionTemplate.content.cloneNode(true);
        const questionCard = newQuestion.querySelector(".question-editor-card");

        questionCard.querySelector(".question-card-title").textContent = `Questão ${questionCounter}`;

        const radioName = `correct-answer-${questionCounter}`;
        questionCard.querySelectorAll(".correct-answer-radio").forEach((radio) => {
            radio.name = radioName;
        });

        const questionTypeSelect = questionCard.querySelector(".question-type-select");
        const answersEditor = questionCard.querySelector(".answers-editor");

        questionTypeSelect.addEventListener("change", (e) => {
            answersEditor.style.display = e.target.value === "multipla-escolha" ? "block" : "none";
        });

        const removeBtn = questionCard.querySelector(".remove-question-btn");
        removeBtn.addEventListener("click", () => {
            questionCard.remove();
        });

        questionList.appendChild(questionCard);
    });

    function validarFormulario() {
        const titulo = document.getElementById("titulo").value.trim();
        const materia = document.getElementById("materia").value.trim();
        const turma = document.getElementById("turma").value.trim();
        const perguntas = document.querySelectorAll(".question-editor-card");

        if (!titulo || !materia || !turma || perguntas.length === 0) {
            return false;
        }

        for (const card of perguntas) {
            const tipo = card.querySelector(".question-type-select").value;
            const perguntaVideo = card.querySelector(".pergunta-video-input").files[0];
            if (!tipo || !perguntaVideo) return false;

            if (tipo === "multipla-escolha") {
                const alternativas = card.querySelectorAll(".alternativa-item");
                let umaCorreta = false;

                for (const alt of alternativas) {
                    const video = alt.querySelector(".alternativa-video-input").files[0];
                    const correta = alt.querySelector(".correct-answer-radio").checked;
                    if (!video) return false;
                    if (correta) umaCorreta = true;
                }

                if (!umaCorreta) return false;
            }
        }

        return true;
    }

    setInterval(() => {
        const valido = validarFormulario();
        publicarBtn.disabled = !valido;
        publicarBtn.setAttribute("data-tooltip", valido ? "" : "Preencha todos os campos obrigatórios para publicar a avaliação.");

    }, 500);

    publicarBtn.addEventListener("click", async function (e) {
        e.preventDefault();

        const titulo = document.getElementById("titulo").value;
        const materia = document.getElementById("materia").value;
        const turma = document.getElementById("turma").value;

        const questionCards = document.querySelectorAll(".question-editor-card");

        const perguntas = [];
        const arquivos = [];

        questionCards.forEach((card) => {
            const tipo = card.querySelector(".question-type-select").value;
            const perguntaFileInput = card.querySelector(".pergunta-video-input");
            const perguntaVideoFile = perguntaFileInput.files[0];
            arquivos.push(perguntaVideoFile);

            const perguntaData = {
                tipo,
                alternativas: null
            };

            if (tipo === "multipla-escolha") {
                const alternativas = [];
                const alternativaItems = card.querySelectorAll(".alternativa-item");

                alternativaItems.forEach((altItem) => {
                    const altVideoInput = altItem.querySelector(".alternativa-video-input");
                    const altVideoFile = altVideoInput.files[0];
                    const correta = altItem.querySelector(".correct-answer-radio").checked;

                    arquivos.push(altVideoFile);
                    alternativas.push({ correta });
                });

                perguntaData.alternativas = alternativas;
            }

            perguntas.push(perguntaData);
        });

        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("materia", materia);
        formData.append("turma", turma);
        formData.append("dados_json", JSON.stringify({ perguntas }));

        arquivos.forEach((file) => {
            formData.append("arquivos", file);
        });

        try {
            const response = await fetch("http://localhost:8001/api/avaliacoes", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            document.querySelector("main").style.display = "none";
            document.getElementById("success-screen").style.display = "flex";
        } catch (err) {
            console.error("Erro ao criar avaliação:", err);
        }
    });

    document.getElementById("nova-avaliacao-btn").addEventListener("click", () => {
        location.reload(); // Reinicia
    });

    document.querySelector(".skip-btn").addEventListener("click", () => {
        alert("Prova salva como rascunho!");
    });
});

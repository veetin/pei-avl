document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("avaliacoes-disponiveis");

  try {
    const response = await fetch("http://localhost:8001/api/aluno/avaliacoes");
    const avaliacoes = await response.json();

    if (avaliacoes.length === 0) {
      container.innerHTML = "<p>Nenhuma avaliação disponível no momento.</p>";
      return;
    }

    avaliacoes.forEach((prova) => {
      const card = document.createElement("div");
      card.className = "assessment-card available";
      card.innerHTML = `
        <div class="card-icon">📚</div>
        <div class="card-info">
            <span class="card-subject">${prova.materia}</span>
            <h3 class="card-title">${prova.titulo}</h3>
            <span class="card-details">${prova.perguntas.length} Questões</span>
        </div>
        <div class="card-action">
            <a href="../prova/prova-instrucoes.html?id=${prova.id}" class="action-link-btn">Iniciar Prova</a>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar avaliações:", err);
    container.innerHTML = "<p>Erro ao carregar avaliações.</p>";
  }
});

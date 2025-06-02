document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("avaliacoes-container");
  container.innerHTML = "<p>Carregando avaliações...</p>";

  fetch("http://localhost:8001/api/avaliacoes")
    .then(res => res.json())
    .then(avaliacoes => {
      if (!avaliacoes.length) {
        container.innerHTML = "<p>Nenhuma avaliação criada ainda.</p>";
        return;
      }

      container.innerHTML = "";

      avaliacoes.forEach(av => {
        const card = document.createElement("div");
        card.className = "assessment-card professor available";

        card.innerHTML = `
          <div class="card-info">
            <span class="card-subject">${av.materia}</span>
            <h3 class="card-title">${av.titulo}</h3>
            <span class="card-details">Turma: ${av.turma}</span>
          </div>
          <div class="card-action-professor">
            <a href="#" class="prof-action-btn results">Resultados</a>
            <a href="#" class="prof-action-btn edit">Editar</a>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar avaliações:", err);
      container.innerHTML = "<p>Erro ao carregar avaliações.</p>";
    });
});

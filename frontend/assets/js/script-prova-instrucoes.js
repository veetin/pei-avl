document.addEventListener("DOMContentLoaded", async () => {
  const provaId = new URLSearchParams(window.location.search).get("id");
  const infoTitulo = document.getElementById("info-titulo");
  const infoMateria = document.getElementById("info-materia");
  const infoTotal = document.getElementById("info-total");
  const infoTipo = document.getElementById("info-tipo");
  const startBtn = document.getElementById("start-test-btn");
  document.getElementById("start-test-btn")?.addEventListener("click", () => {
    localStorage.removeItem("prova-tempo-segundos");
  });
  if (!provaId) {
    alert("ID da prova não fornecido.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8001/api/aluno/avaliacao/${provaId}`);
    const data = await response.json();

    if (data.erro) {
      alert("Avaliação não encontrada.");
      return;
    }

    infoTitulo.textContent = data.titulo;
    infoMateria.textContent = data.materia;
    infoTotal.textContent = data.perguntas.length;

    const tipos = [...new Set(data.perguntas.map(p => p.tipo))];
    const tipoFormatado = tipos.map(t =>
      t === "multipla-escolha" ? "Múltipla Escolha" : "Envio de Vídeo"
    ).join(" e ");
    infoTipo.textContent = tipoFormatado;

    // Redireciona para página unificada com ?id e ?q=1
    startBtn.href = `/prova/prova-unificada.html?id=${provaId}&q=1`;
  } catch (err) {
    console.error("Erro ao carregar a prova:", err);
    alert("Erro ao carregar dados da prova.");
  }

});

document.addEventListener("DOMContentLoaded", async () => {
  const provaId = new URLSearchParams(window.location.search).get("id");
  if (!provaId) {
    alert("ID da prova não fornecido.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8001/api/avaliacoes/${provaId}`);
    const data = await res.json();
    if (!data || !data.perguntas || data.perguntas.length === 0) {
      alert("Avaliação inválida ou sem questões.");
      return;
    }

    const primeiraQuestao = data.perguntas[0];
    if (primeiraQuestao.tipo === "multipla-escolha") {
      window.location.href = `prova-multipla-escolha.html?id=${provaId}&q=1`;
    } else {
      window.location.href = `prova-envio-video.html?id=${provaId}&q=1`;
    }
  } catch (err) {
    console.error("Erro ao buscar dados da prova:", err);
    alert("Erro ao carregar a prova.");
  }
});

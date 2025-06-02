from pydantic import BaseModel
from typing import Optional

class RespostaAluno(BaseModel):
    aluno_id: str
    avaliacao_id: int
    pergunta_id: int
    tipo: str  # "multipla-escolha" ou "envio-video"
    resposta: Optional[str]  # Letra (A, B, C, D) ou caminho do vídeo

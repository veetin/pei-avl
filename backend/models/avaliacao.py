from pydantic import BaseModel
from typing import List, Optional

class Alternativa(BaseModel):
    correta: bool

class Pergunta(BaseModel):
    tipo: str  # "multipla-escolha" ou "envio-video"
    alternativas: Optional[List[Alternativa]]

class AvaliacaoCreate(BaseModel):
    titulo: str
    materia: str
    turma: str
    perguntas: List[Pergunta]

class Avaliacao(AvaliacaoCreate):
    id: int

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List
import json

from services.avaliacoes import criar_avaliacao, carregar_avaliacoes, UPLOAD_DIR
from models.avaliacao import Avaliacao

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/avaliacoes", response_model=Avaliacao)
async def post_avaliacao(
    titulo: str = Form(...),
    materia: str = Form(...),
    turma: str = Form(...),
    dados_json: str = Form(...),
    arquivos: List[UploadFile] = File(...)
):
    print("✅ dados_json:", dados_json)
    print("📦 arquivos recebidos:", [f.filename for f in arquivos])
    
    data = {
        "titulo": titulo,
        "materia": materia,
        "turma": turma,
        **json.loads(dados_json)
    }
    return criar_avaliacao(data, arquivos)

@app.get("/api/avaliacoes", response_model=List[Avaliacao])
def listar_avaliacoes():
    return carregar_avaliacoes()

# Servir os vídeos
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

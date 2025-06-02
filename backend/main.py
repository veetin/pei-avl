from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List
import json
from fastapi import FastAPI, HTTPException
from services.avaliacoes import criar_avaliacao, carregar_avaliacoes, UPLOAD_DIR, buscar_avaliacao_por_id
from services import provas
from models.avaliacao import Avaliacao

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir o frontend
app.mount("/", StaticFiles(directory="/home/vhugo/workspace/faculdade/pei/avl/frontend", html=True), name="frontend")


@app.get("/api/avaliacoes/{avaliacao_id}/questoes")
def obter_questoes(avaliacao_id: int):
    avaliacoes = carregar_avaliacoes()
    for avaliacao in avaliacoes:
        if avaliacao["id"] == avaliacao_id:
            return {"titulo": avaliacao["titulo"], "materia": avaliacao["materia"], "turma": avaliacao["turma"], "perguntas": avaliacao["perguntas"]}
    raise HTTPException(status_code=404, detail="Avaliação não encontrada")

@app.get("/api/aluno/avaliacoes")
def get_avaliacoes_disponiveis():
    return carregar_avaliacoes()

@app.get("/api/aluno/avaliacao/{avaliacao_id}")
def get_avaliacao_completa(avaliacao_id: int):
    todas = carregar_avaliacoes()
    for a in todas:
        if a["id"] == avaliacao_id:
            return a
    return {"erro": "Avaliação não encontrada"}

@app.post("/api/aluno/responder")
async def responder_avaliacao(
    aluno_id: str = Form(...),
    avaliacao_id: int = Form(...),
    pergunta_id: int = Form(...),
    tipo: str = Form(...),
    resposta: str = Form(None),
    video: UploadFile = File(None)
):
    resposta_final = resposta
    if tipo == "envio-video" and video:
        resposta_final = provas.salvar_resposta_video(avaliacao_id, aluno_id, video)

    provas.registrar_resposta({
        "aluno_id": aluno_id,
        "avaliacao_id": avaliacao_id,
        "pergunta_id": pergunta_id,
        "tipo": tipo,
        "resposta": resposta_final
    })

    return {"status": "ok"}


@app.get("/api/avaliacoes/{avaliacao_id}")
def get_avaliacao(avaliacao_id: int):
    try:
        avaliacao = buscar_avaliacao_por_id(avaliacao_id)
        return avaliacao
    except ValueError:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")

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


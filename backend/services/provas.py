import os, json, shutil
from typing import List, Dict
from fastapi import UploadFile
from uuid import uuid4

DB_RESPOSTAS = "/home/vhugo/workspace/faculdade/pei/avl/backend/db/respostas.json"
UPLOAD_RESPOSTAS = "/home/vhugo/workspace/faculdade/pei/avl/backend/uploads/respostas"
os.makedirs(UPLOAD_RESPOSTAS, exist_ok=True)

def carregar_respostas() -> List[Dict]:
    if not os.path.exists(DB_RESPOSTAS):
        return []
    with open(DB_RESPOSTAS, "r") as f:
        return json.load(f)

def salvar_respostas(respostas: List[Dict]):
    with open(DB_RESPOSTAS, "w") as f:
        json.dump(respostas, f, indent=2)

def salvar_resposta_video(avaliacao_id: int, aluno_id: str, video: UploadFile) -> str:
    pasta = os.path.join(UPLOAD_RESPOSTAS, f"avaliacao_{avaliacao_id}", aluno_id)
    os.makedirs(pasta, exist_ok=True)
    ext = os.path.splitext(video.filename)[-1]
    filename = f"{uuid4()}{ext}"
    path = os.path.join(pasta, filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)
    return f"/uploads/respostas/avaliacao_{avaliacao_id}/{aluno_id}/{filename}"

def registrar_resposta(resposta: Dict):
    respostas = carregar_respostas()
    respostas.append(resposta)
    salvar_respostas(respostas)

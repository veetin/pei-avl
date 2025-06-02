import os, json, shutil
from typing import List, Dict
from fastapi import UploadFile
from uuid import uuid4

DB_FILE = "/home/vhugo/workspace/faculdade/pei/avl/backend/db/avaliacoes.json"
UPLOAD_DIR = "/home/vhugo/workspace/faculdade/pei/avl/backend/uploads"

# Garante que os diretórios existam
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)

def carregar_avaliacoes() -> List[Dict]:
    if not os.path.exists(DB_FILE):
        return []
    with open(DB_FILE, "r") as f:
        return json.load(f)

def salvar_avaliacoes(avaliacoes: List[Dict]):
    with open(DB_FILE, "w") as f:
        json.dump(avaliacoes, f, indent=2)

def salvar_arquivo(video: UploadFile, avaliacao_id: int, nome: str) -> str:
    ext = os.path.splitext(video.filename)[-1]
    safe_name = f"{nome}_{uuid4().hex}{ext}"
    dir_path = os.path.join(UPLOAD_DIR, "avaliacoes", str(avaliacao_id))
    os.makedirs(dir_path, exist_ok=True)

    path = os.path.join(dir_path, safe_name)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    return f"/uploads/avaliacoes/{avaliacao_id}/{safe_name}"

def criar_avaliacao(data: Dict, arquivos: List[UploadFile]) -> Dict:
    avaliacoes = carregar_avaliacoes()
    novo_id = max([a["id"] for a in avaliacoes], default=0) + 1
    file_iter = iter(arquivos)

    nova_avaliacao = {
        "id": novo_id,
        "titulo": data["titulo"],
        "materia": data["materia"],
        "turma": data["turma"],
        "perguntas": []
    }

    pergunta_id = 1
    alternativa_id = 1

    for pergunta in data["perguntas"]:
        pergunta_video_url = salvar_arquivo(next(file_iter), novo_id, f"pergunta_{pergunta_id}")

        nova_pergunta = {
            "id": pergunta_id,
            "tipo": pergunta["tipo"],
            "pergunta_video_url": pergunta_video_url,
            "alternativas": []
        }
        pergunta_id += 1

        if pergunta["tipo"] == "multipla-escolha":
            for alt in pergunta["alternativas"]:
                alternativa_video_url = salvar_arquivo(next(file_iter), novo_id, f"alt_{pergunta_id}_{alternativa_id}")
                nova_pergunta["alternativas"].append({
                    "id": alternativa_id,
                    "video_url": alternativa_video_url,
                    "correta": alt["correta"]
                })
                alternativa_id += 1

        nova_avaliacao["perguntas"].append(nova_pergunta)

    avaliacoes.append(nova_avaliacao)
    salvar_avaliacoes(avaliacoes)
    return nova_avaliacao

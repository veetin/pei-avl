
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

app = FastAPI()

FRONTEND_DIR = "frontend"
TEMPLATES_DIR = os.path.join(FRONTEND_DIR, "templates")
templates = Jinja2Templates(directory="frontend/templates")
# Servir arquivos estáticos (JS, CSS, imagens)
app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")


@app.get("/index")
def serve_index(request: Request):
    return templates.TemplateResponse("prova/prova-instrucoes.html", {"request": request})



@app.get("/prova/prova-instrucoes")
def serve_prova_prova_instrucoes():
    return FileResponse(os.path.join(TEMPLATES_DIR, f"prova/prova-instrucoes.html"))

@app.get("/prova/prova-envio-video")
def serve_prova_prova_envio_video():
    return FileResponse(os.path.join(TEMPLATES_DIR, "prova/prova-envio-video.html"))

@app.get("/prova/prova-criar")
def serve_prova_prova_criar():
    return FileResponse(os.path.join(TEMPLATES_DIR, "prova/prova-criar.html"))

@app.get("/prova/prova-multipla-escolha")
def serve_prova_prova_multipla_escolha():
    return FileResponse(os.path.join(TEMPLATES_DIR, "prova/prova-multipla-escolha.html"))


@app.get("/prova/{page_name}")
def servir_prova(page_name: str):
    file_path = f"frontend/templates/prova/{page_name}"
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"erro": "Página não encontrada"}


@app.get("/professor/professor-login")
def serve_professor_professor_login():
    return FileResponse(os.path.join(TEMPLATES_DIR, "professor/professor-login.html"))

@app.get("/professor/professor-area")
def serve_professor_professor_area():
    return FileResponse(os.path.join(TEMPLATES_DIR, "professor/professor-area.html"))

@app.get("/aluno/aluno-login")
def serve_aluno_aluno_login():
    return FileResponse(os.path.join(TEMPLATES_DIR, "aluno/aluno-login.html"))

@app.get("/aluno/aluno-area")
def serve_aluno_aluno_area():
    return FileResponse(os.path.join(TEMPLATES_DIR, "aluno/aluno-area.html"))

@app.get("/")
def redirect_to_index():
    return FileResponse(os.path.join(TEMPLATES_DIR, "index.html"))



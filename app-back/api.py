from fastapi import FastAPI

from routers.auth import auth
from routers.movements import movements
from routers.product import product
from routers.admin import admin
from fastapi.middleware.cors import CORSMiddleware

# Instanciamos la clase FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia "*" por el dominio específico si es necesario
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluimos las rutas de autenticación
app.include_router(auth.router)
# app.include_router(template.router)
app.include_router(movements.router)
app.include_router(product.router)
app.include_router(admin.router)
from fastapi import FastAPI

from routers.auth import auth
from routers.movements import movements
from routers.product import product
from routers.admin import admin

# Instanciamos la clase FastAPI
app = FastAPI()

# Incluimos las rutas de autenticación
app.include_router(auth.router)
# app.include_router(template.router)
app.include_router(movements.router)
app.include_router(product.router)
app.include_router(admin.router)
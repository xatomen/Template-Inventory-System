from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Modelo de usuario
class UserModel(BaseModel):
    name: str
    lastname: str
    email: str
    password_hash: str

# Modelo de producto
class ProductModel(BaseModel):
    name: str
    barcode: str

# Modelo de entrada
class InputModel(BaseModel):
    qty: int
    barcode: str

# Modelo de salida
class OutputModel(BaseModel):
    qty: int
    barcode: str
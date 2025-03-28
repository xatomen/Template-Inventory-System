# Router de autenticación

# Importamos configruación de la base de datos
from database import *

# Importamos el modelo de usuario desde la base de datos
from models import UserModel

# Importamos la lógica de seguridad
from security import *

# Importamos las librerías necesarias
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
import datetime

# Instanciamos el router
router = APIRouter()

# Crear usuario
@router.post("/create-user", tags=["Auth"])
def create_user(user: UserModel, db: Session = Depends(get_db)):
    # Verificar si el nombre/apellido ya existe
    existing_user = db.query(UserDB).filter(
        UserDB.name == user.name,
        UserDB.lastname == user.lastname,
        ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Verificar si el correo electrónico ya existe
    existing_email = db.query(UserDB).filter(UserDB.email == user.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    # Si no existe, creamos el usuario
    new_user = UserDB(
        name=user.name,
        lastname=user.lastname,
        email=user.email,
        password_hash=hash_password(user.password_hash),
        created_at=datetime.datetime.now(),
        deleted_at=None,
        is_active=True,
        is_admin=False
        )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Inicio de sesión
@router.post("/login", tags=["Auth"])
def login(user: UserModel, db: Session = Depends(get_db)):
    # Buscamos el usuario en la base de datos por su correo electrónico
    user_db = db.query(UserDB).filter(UserDB.email == user.email).first()
    # Si el usuario no existe, no autorizaoms
    if not user_db:
        raise HTTPException(status_code=401, detail="Unauthorized")
    # Si la contraseña no coincide, no autorizamos
    if user_db.password_hash != hash_password(user.password_hash):
        raise HTTPException(status_code=401, detail="Unauthorized")
    # Si todo está bien, generamos el token y lo devolvemos
    token_data = {
        "sub": user_db.email,
        "name": user_db.name,
        "lastname": user_db.lastname,
        "exp": datetime.datetime.now() + datetime.timedelta(minutes=10)  # Tiempo de expiración del token
        }
    token = jwt.encode(token_data, "secret", algorithm="HS256")
    
    # Crear una respuesta con la cookie HTTPOnly
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",  # Nombre de la cookie
        value=token,         # Valor de la cookie (el token)
        httponly=True,       # Hacer la cookie HTTPOnly
        secure=True,         # Usar solo en HTTPS (puedes desactivarlo en desarrollo)
        samesite="Strict",   # Evitar que la cookie se envíe en solicitudes de otros sitios
        max_age=600,         # Tiempo de expiración en segundos (10 minutos en este caso)
    )
    return response

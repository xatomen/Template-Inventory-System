# Router de ejemplo

# Importamos configruación de la base de datos
from database import *

# Importamos el modelo de usuario desde la base de datos
from models import *

# Importamos la lógica de seguridad
from security import *

# Importamos las librerías necesarias
from fastapi import APIRouter, Depends, HTTPException
import datetime

# Instanciamos el router
router = APIRouter()

# Obtener el listado de usuarios
@router.get("/users", tags=["Admin"])
def get_users(user: UserModel, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        # Verificamos el token
        payload = jwt.decode(token, "secret", algorithms=["HS256"])

        # Buscamos el usuario en la base de datos por su correo electrónico
        user_db = db.query(UserDB).filter(UserDB.email == payload["sub"]).first()

        # Si el usuario no existe, no autorizamos
        if not user_db:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Si el usuario no es administrador, no autorizamos
        if not user_db.is_admin:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Obtenemos el listado de usuarios activos
        users = db.query(UserDB).filter(UserDB.is_active == True).all()

        return users
    
    # Si el token expiró, devolvemos un error
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    
    # Si el token es inválido, devolvemos un error
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
# Eliminar un usuario
@router.post("/delete-user", tags=["Admin"])
def delete_user(user: UserModel, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        # Verificamos el token
        payload = jwt.decode(token, "secret", algorithms=["HS256"])

        # Buscamos el usuario en la base de datos por su correo electrónico
        user_db = db.query(UserDB).filter(UserDB.email == payload["sub"]).first()

        # Si el usuario no existe, no autorizamos
        if not user_db:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Si el usuario no es administrador, no autorizamos
        if not user_db.is_admin:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Buscamos el usuario en la base de datos por su nombre y apellido
        user_db = db.query(UserDB).filter(
            UserDB.id == user.id
            ).first()
        # Si el usuario no existe, devolvemos un error
        if not user_db:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Eliminamos el usuario (desactivamos)
        user_db.is_active = False
        db.commit()
        db.refresh(user_db)

        return user_db
    
    # Si el token expiró, devolvemos un error
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    
    # Si el token es inválido, devolvemos un error
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

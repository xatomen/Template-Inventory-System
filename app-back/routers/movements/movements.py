# Router de ejemplo

# Importamos configruación de la base de datos
from database import *

# Importamos el modelo de usuario desde la base de datos
from models import *

# Importamos la lógica de seguridad
from security import *

# Importamos las librerías necesarias
from fastapi import APIRouter, Depends, HTTPException, Request
import datetime

# Instanciamos el router
router = APIRouter()

# Input de un producto
@router.post("/input", tags=["Movements"])
def input_product(input: InputModel, request: Request, db: Session = Depends(get_db)):
    try:
        # Leer la cookie de la solicitud
        token = request.cookies.get("access_token")
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
        
        # Buscamos el producto en la base de datos por su barcode
        product_db = db.query(ProductDB).filter(ProductDB.barcode == input.barcode).first()
        # Si el producto no existe, devolvemos un error
        if not product_db:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Creamos la entrada
        new_input = InputDB(
            date=datetime.datetime.now(),
            qty=input.qty,
            user_id=user_db.id,
            product_id=product_db.id
            )
        db.add(new_input)
        db.commit()
        db.refresh(new_input)

        # Actualizamos la cantidad del producto
        product_db.qty += input.qty
        db.commit()
        db.refresh(product_db)

        return new_input

    # Si el token expiró, devolvemos un error
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    # Si el token es inválido, devolvemos un error
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
# Output de un producto
@router.post("/output", tags=["Movements"])
def output_product(output: OutputModel, request: Request, db: Session = Depends(get_db)):
    try:
        # Leer la cookie de la solicitud
        token = request.cookies.get("access_token")
        # Verificamos el token
        payload = jwt.decode(token, "secret", algorithms=["HS256"])

        # Buscamos el usuario en la base de datos por su correo electrónico
        user_db = db.query(UserDB).filter(UserDB.email == payload["sub"]).first()
        # Si el usuario no existe, no autorizamos
        if not user_db:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Buscamos el producto en la base de datos por su barcode
        product_db = db.query(ProductDB).filter(ProductDB.barcode == output.barcode).first()
        # Si el producto no existe, devolvemos un error
        if not product_db:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Creamos la salida
        new_output = OutputDB(
            date=datetime.datetime.now(),
            qty=output.qty,
            user_id=user_db.id,
            product_id=product_db.id
            )
        db.add(new_output)
        db.commit()
        db.refresh(new_output)
        
        # Descontamos la cantidad de productos
        product_db.qty -= output.qty
        db.commit()
        db.refresh(product_db)

        return new_output

    # Si el token expiró, devolvemos un error
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    # Si el token es inválido, devolvemos un error
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Obtener todos los movimientos
@router.get("/movements", tags=["Movements"])
def get_movements(request: Request, db: Session = Depends(get_db)):
    try:
        # Leer la cookie de la solicitud
        token = request.cookies.get("access_token")
        # Verificamos el token
        payload = jwt.decode(token, "secret", algorithms=["HS256"])

        # Buscamos el usuario en la base de datos por su correo electrónico
        user_db = db.query(UserDB).filter(UserDB.email == payload["sub"]).first()
        # Si el usuario no existe, no autorizamos
        if not user_db:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Si el usuario es administrador, mostramos todos los movimientos
        if user_db.is_admin:
            movements = db.query(InputDB).all() + db.query(OutputDB).all()
        # Si no, mostramos solo los movimientos del usuario
        else:
            movements = db.query(InputDB).filter(InputDB.user_id == user_db.id).all() + db.query(OutputDB).filter(OutputDB.user_id == user_db.id).all()
        
        return movements

    # Si el token expiró, devolvemos un error
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    # Si el token es inválido, devolvemos un error
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
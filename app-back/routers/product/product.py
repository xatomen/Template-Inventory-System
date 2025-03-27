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

# Crear producto
@router.post("/create-product", tags=["Product"])
def create_product(product: ProductModel, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
        
        # Verificar si el producto ya existe
        existing_product = db.query(ProductDB).filter(ProductDB.barcode == product.barcode).first()
        if existing_product:
            raise HTTPException(status_code=400, detail="Product already exists")
        
        # Creamos el producto
        new_product = ProductDB(
            name=product.name,
            barcode=product.barcode,
            price=product.price,
            qty=0,
            created_at=datetime.datetime.now(),
            deleted_at=None,
            is_active=True
            )
        db.add(new_product)
        db.commit()
        db.refresh(new_product)

        return new_product
    
    # Si el token expiró, devolvemos un error
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    
    # Si el token es inválido, devolvemos un error
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
# Obtener el listado de productos
@router.get("/products", tags=["Product"])
def get_products(product: ProductModel, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        # Verificamos el token
        payload = jwt.decode(token, "secret", algorithms=["HS256"])

        # Buscamos el usuario en la base de datos por su correo electrónico
        user_db = db.query(UserDB).filter(UserDB.email == payload["sub"]).first()

        # Si el usuario no existe, no autorizamos
        if not user_db:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Obtenemos el listado de productos que están activos
        products = db.query(ProductDB).filter(ProductDB.is_active == True).all()

        return products
    
    # Si el token expiró, devolvemos un error
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    
    # Si el token es inválido, devolvemos un error
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
# Eliminar un producto
@router.post("/delete-product", tags=["Product"])
def delete_product(product: ProductModel, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
        
        # Buscamos el producto en la base de datos por su barcode
        product_db = db.query(ProductDB).filter(ProductDB.barcode == product.barcode).first()
        # Si el producto no existe, devolvemos un error
        if not product_db:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Eliminamos el producto
        product_db.is_active = False
        product_db.deleted_at = datetime.datetime.now()
        db.commit()
        db.refresh(product_db)

        return product_db
    
    # Si el token expiró, devolvemos un error
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    
    # Si el token es inválido, devolvemos un error
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
# Importamos sqlalchemy
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Time, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session

# Importamos decouple
from decouple import Config, RepositoryEnv
from decouple import config

config = Config(RepositoryEnv(".env"))

DB_USER = config("DB_USER")
DB_PASSWORD = config("DB_PASSWORD")
DB_HOST = config("DB_HOST")
DB_PORT = config("DB_PORT")
DB_NAME = config("DB_NAME")

SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Definimos las tablas de la base de datos
Base = declarative_base()

class UserDB(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    lastname = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False)
    deleted_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)

class ProductDB(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(45), nullable=False)
    barcode = Column(String(45), nullable=False)
    qty = Column(Integer, nullable=False)

class InputDB(Base):
    __tablename__ = "input"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(45), nullable=False)
    date = Column(DateTime, nullable=False)
    qty = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)

    user = relationship("UserDB", back_populates="inputs")
    product = relationship("ProductDB", back_populates="inputs")

class OutputDB(Base):
    __tablename__ = "output"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(45), nullable=False)
    date = Column(DateTime, nullable=False)
    qty = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)

    user = relationship("UserDB", back_populates="outputs")
    product = relationship("ProductDB", back_populates="outputs")

# Agregar relaciones en UserDB y ProductDB
UserDB.inputs = relationship("InputDB", back_populates="user", cascade="all, delete-orphan")
UserDB.outputs = relationship("OutputDB", back_populates="user", cascade="all, delete-orphan")
ProductDB.inputs = relationship("InputDB", back_populates="product", cascade="all, delete-orphan")
ProductDB.outputs = relationship("OutputDB", back_populates="product", cascade="all, delete-orphan")

# Función para conectarse a la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
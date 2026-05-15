from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM  = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES  = 60 * 24      # 1 day
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # bcrypt has a 72-byte limit — truncate to be safe
    password_bytes = password.encode('utf-8')[:72]
    password = password_bytes.decode('utf-8', errors='ignore')
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    plain_bytes = plain.encode('utf-8')[:72]
    plain = plain_bytes.decode('utf-8', errors='ignore')
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["exp"]  = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode["type"] = "access"
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["exp"]  = datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    to_encode["type"] = "refresh"
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
from cryptography.fernet import Fernet
import os

# Secure key for symmetric encryption
# In production, this should be stored in an environment variable
VAULT_KEY = os.environ.get('VAULT_ENCRYPTION_KEY', 'c848edjZ9JX804Y4afhz-nlz3rrZFukz_Kc92ifzZ3c=')

def encrypt_password(plain_text):
    if not plain_text:
        return plain_text
    try:
        f = Fernet(VAULT_KEY.encode())
        return f.encrypt(plain_text.encode()).decode()
    except Exception as e:
        print(f"Encryption error: {e}")
        return plain_text

def decrypt_password(encrypted_text):
    if not encrypted_text:
        return encrypted_text
    try:
        f = Fernet(VAULT_KEY.encode())
        return f.decrypt(encrypted_text.encode()).decode()
    except Exception:
        # If decryption fails, it might be already in plain text
        return encrypted_text

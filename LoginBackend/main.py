from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from azure.data.tables import TableClient
from utils import hash_password, verify_password
from dotenv import load_dotenv
import os
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

# Azure Table Setup
TABLE_CONN_STRING = os.getenv("AZURE_TABLE_CONN_STRING")
ADMIN_TABLE_NAME = os.getenv("ADMIN_AZURE_TABLE_NAME")
USERS_TABLE_NAME = os.getenv("USERS_AZURE_TABLE_NAME")
PARTITION_KEY = "auth"  # Fixed partition key as per your structure

# Initialize table clients
try:
    admin_table_client = TableClient.from_connection_string(
        conn_str=TABLE_CONN_STRING, 
        table_name=ADMIN_TABLE_NAME
    )
    users_table_client = TableClient.from_connection_string(
        conn_str=TABLE_CONN_STRING, 
        table_name=USERS_TABLE_NAME
    )
except Exception as e:
    print(f"Error initializing table clients: {str(e)}")
    raise

# Pydantic Schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class AdminLoginRequest(LoginRequest):
    is_admin: bool = True

def query_user(email: str, is_admin: bool = False) -> Optional[dict]:
    """Query user from either AdminApp or UsersApp table"""
    try:
        # Try AdminApp first if explicitly requested
        if is_admin:
            try:
                entity = admin_table_client.get_entity(
                    partition_key=PARTITION_KEY,
                    row_key=email
                )
                return {"user": entity, "is_admin": True}
            except Exception as e:
                print(f"Admin lookup failed for {email}: {str(e)}")
                return None

        # For regular users, first try UsersApp
        try:
            entity = users_table_client.get_entity(
                partition_key=PARTITION_KEY,
                row_key=email
            )
            return {"user": entity, "is_admin": False}
        except Exception as e:
            print(f"User lookup failed for {email}, trying admin table: {str(e)}")
            # If not found in UsersApp, try AdminApp
            try:
                entity = admin_table_client.get_entity(
                    partition_key=PARTITION_KEY,
                    row_key=email
                )
                return {"user": entity, "is_admin": True}
            except Exception as e:
                print(f"Admin fallback lookup failed: {str(e)}")
                return None
    except Exception as e:
        print(f"Error querying user {email}: {str(e)}")
        return None

# API: Admin Login
@app.post("/api/admin/login")
def admin_login(data: AdminLoginRequest):
    try:
        # Only check AdminApp for admin login
        user_data = query_user(data.email, is_admin=True)
        
        if not user_data or not user_data["is_admin"]:
            raise HTTPException(status_code=401, detail="Invalid admin credentials")
            
        stored_hash = user_data["user"].get("HashedPassword")
        if not stored_hash or not verify_password(data.password, stored_hash):
            raise HTTPException(status_code=401, detail="Invalid admin credentials")
            
        return {
            "message": "Admin login successful",
            "user": {
                "name": user_data["user"].get("RowKey", "Admin User"),
                "email": data.email,
                "is_admin": True
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Admin login failed: {str(e)}")

# API: Regular User Login
@app.post("/api/login")
def login(data: LoginRequest):
    try:
        # Check both tables for regular login
        user_data = query_user(data.email)
        
        if not user_data:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        stored_hash = user_data["user"].get("HashedPassword")
        if not stored_hash or not verify_password(data.password, stored_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        return {
            "message": "Login successful",
            "user": {
                "name": user_data["user"].get("RowKey", "User"),
                "email": data.email,
                "is_admin": user_data["is_admin"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "tables": {
            "admin": "available" if admin_table_client else "unavailable",
            "users": "available" if users_table_client else "unavailable"
        }
    }

# Add this near your other Pydantic models
class UpdatePasswordRequest(BaseModel):
    email: str
    new_password: str

# Add these new endpoints before the health check

@app.get("/api/admin/users")
def get_all_users():
    try:
        # Query all users from the users table
        users = list(users_table_client.query_entities(
            query_filter=f"PartitionKey eq '{PARTITION_KEY}'"
        ))
        
        # Format the response
        user_list = [{
            "email": user["RowKey"],
            "hashed_password": user.get("HashedPassword", "")
        } for user in users]
        
        return {"users": user_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch users: {str(e)}")

@app.put("/api/admin/users/update-password")
def update_user_password(data: UpdatePasswordRequest):
    try:
        # Get the user entity
        entity = users_table_client.get_entity(
            partition_key=PARTITION_KEY,
            row_key=data.email
        )
        
        # Update the password
        entity["HashedPassword"] = hash_password(data.new_password)
        entity["UpdatedAt"] = datetime.utcnow().isoformat()
        
        # Save changes
        users_table_client.update_entity(mode="merge", entity=entity)
        
        return {"message": f"Password updated for {data.email}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update password: {str(e)}")


# Add this near your other Pydantic models
class CreateUserRequest(BaseModel):
    email: str
    password: str

@app.post("/api/admin/users/add")
def add_user(data: CreateUserRequest):
    try:
        # Check if user exists
        try:
            users_table_client.get_entity(PARTITION_KEY, data.email)
            raise HTTPException(status_code=409, detail="User already exists")
        except:
            pass  # If not found, continue

        hashed_pw = hash_password(data.password)
        users_table_client.create_entity({
            "PartitionKey": PARTITION_KEY,
            "RowKey": data.email,
            "HashedPassword": hashed_pw,
            "CreatedAt": datetime.utcnow().isoformat()
        })
        return {"message": "User created successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add user: {str(e)}")

@app.delete("/api/admin/users/delete/{email}")
def delete_user(email: str):
    try:
        users_table_client.delete_entity(
            partition_key=PARTITION_KEY,
            row_key=email
        )
        return {"message": f"User {email} deleted successfully"}
    except Exception as e:
        if "ResourceNotFound" in str(e):
            raise HTTPException(status_code=404, detail="User not found")
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app.mount("/", StaticFiles(directory="static/dist", html=True), name="static")

@app.get("/{full_path:path}")
async def serve_react_app():
    return FileResponse("static/dist/index.html")
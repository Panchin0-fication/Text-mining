from fastapi import FastAPI
from routes.route import router
from fastapi.middleware.cors import CORSMiddleware
from my_secrets.handle_secrets import(settings)

app = FastAPI()

origins = [
    settings.origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,    
    allow_credentials=True,        
    allow_methods=["*"],           
    allow_headers=["*"],           
)

app.include_router(router)
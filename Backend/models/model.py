from pydantic import BaseModel

class LookupRequest(BaseModel):
    one_hot_token: list[int]
    all_tokens: list[str]
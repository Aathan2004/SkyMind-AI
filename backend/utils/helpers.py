from datetime import datetime

def format_datetime(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def success_response(data, message: str = "Success") -> dict:
    return {"status": "success", "message": message, "data": data}

def error_response(message: str) -> dict:
    return {"status": "error", "message": message}

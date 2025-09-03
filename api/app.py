# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
from typing import Optional
from pathlib import Path

# Initialize FastAPI application with a title
app = FastAPI(title="OpenAI Chat API")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Mount static files from the frontend directory
frontend_path = Path(__file__).parent.parent / "frontend"
print(f"Frontend path: {frontend_path}")
print(f"Frontend path exists: {frontend_path.exists()}")
print(f"Frontend path absolute: {frontend_path.absolute()}")

if frontend_path.exists():
    print(f"Mounting static files from: {frontend_path}")
    try:
        app.mount("/static", StaticFiles(directory=str(frontend_path)), name="static")
        print("Static files mounted successfully")
    except Exception as e:
        print(f"Error mounting static files: {e}")
else:
    print(f"ERROR: Frontend path does not exist: {frontend_path}")
    print(f"Current working directory: {Path.cwd()}")
    print(f"API directory: {Path(__file__).parent}")

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatRequest(BaseModel):
    developer_message: Optional[str] = ""  # Message from the developer/system (optional)
    user_message: str      # Message from the user
    model: Optional[str] = "gpt-4.1-mini"  # Optional model selection with default
    api_key: str          # OpenAI API key for authentication

# Root route to serve the frontend
@app.get("/", response_class=HTMLResponse)
async def root():
    """Serve the main frontend HTML file"""
    frontend_file = frontend_path / "index.html"
    if frontend_file.exists():
        with open(frontend_file, 'r', encoding='utf-8') as f:
            return HTMLResponse(content=f.read())
    else:
        return HTMLResponse(content="""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Ocean Chat - Frontend Not Found</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .error { color: #e74c3c; }
                .info { color: #3498db; }
            </style>
        </head>
        <body>
            <h1 class="error">Frontend Not Found</h1>
            <p class="info">The frontend files are not in the expected location.</p>
            <p>Please ensure the frontend directory exists and contains index.html</p>
            <p>Current working directory: {}</p>
        </body>
        </html>
        """.format(frontend_path))

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Initialize OpenAI client with the provided API key
        client = OpenAI(api_key=request.api_key)
        
        # Prepare messages array
        messages = []
        
        # Add developer message only if it's not empty
        if request.developer_message and request.developer_message.strip():
            messages.append({"role": "developer", "content": request.developer_message})
        
        # Add user message
        messages.append({"role": "user", "content": request.user_message})
        
        # Create an async generator function for streaming responses
        async def generate():
            # Create a streaming chat completion request
            stream = client.chat.completions.create(
                model=request.model,
                messages=messages,
                stream=True  # Enable streaming response
            )
            
            # Yield each chunk of the response as it becomes available
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        # Handle any errors that occur during processing
        raise HTTPException(status_code=500, detail=str(e))

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Simple test endpoint
@app.get("/api/test")
async def test_endpoint():
    """Simple test endpoint to verify the server is working"""
    return {
        "status": "success",
        "message": "Server is running and responding!",
        "timestamp": "now",
        "endpoints": {
            "health": "/api/health",
            "test": "/api/test",
            "test_openai": "/api/test-openai (POST with API key)",
            "chat": "/api/chat (POST with chat request)",
            "debug": "/api/debug (POST with any data)"
        }
    }

# Debug static files endpoint
@app.get("/api/debug-static")
async def debug_static():
    """Debug endpoint to check static file configuration"""
    return {
        "frontend_path": str(frontend_path),
        "frontend_exists": frontend_path.exists(),
        "frontend_absolute": str(frontend_path.absolute()),
        "current_working_dir": str(Path.cwd()),
        "api_dir": str(Path(__file__).parent),
        "static_files": [
            str(frontend_path / "index.html"),
            str(frontend_path / "script.js"),
            str(frontend_path / "styles.css")
        ],
        "files_exist": {
            "index.html": (frontend_path / "index.html").exists(),
            "script.js": (frontend_path / "script.js").exists(),
            "styles.css": (frontend_path / "styles.css").exists()
        }
    }

# Debug endpoint to see request format
@app.post("/api/debug")
async def debug_request(request: dict):
    """Debug endpoint to see what data is being sent"""
    return {
        "received_data": request,
        "message": "This endpoint shows you exactly what data was received"
    }

# Test OpenAI API endpoint
@app.post("/api/test-openai")
async def test_openai(request: dict):
    """Test OpenAI API connection and basic functionality"""
    try:
        api_key = request.get("api_key")
        if not api_key:
            return {"error": "API key required"}
        
        client = OpenAI(api_key=api_key)
        
        # Try a simple completion
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Say 'Hello, OpenAI API is working!'"}],
            max_tokens=50
        )
        
        return {
            "status": "success",
            "message": "OpenAI API is working!",
            "response": response.choices[0].message.content,
            "model_used": "gpt-3.5-turbo"
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "message": "OpenAI API test failed"
        }

# GET version of test endpoint for browser testing
@app.get("/api/test-openai")
async def test_openai_get():
    """Test endpoint accessible via GET request"""
    return {
        "message": "This is a GET endpoint for testing",
        "instructions": "To test your OpenAI API key, use POST with your API key in the request body",
        "example": {
            "method": "POST",
            "url": "/api/test-openai",
            "body": {"api_key": "your-api-key-here"}
        }
    }

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Use the light version of Python
FROM python:3.10-slim

# Set working directory in the server
WORKDIR /app

# Copy library list and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files from backend to server
COPY . .

# Create data folder to avoid errors when starting
RUN mkdir -p data && chmod 777 data

# Hugging Face Spaces uses port 7860 by default
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
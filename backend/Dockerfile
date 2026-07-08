FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (needed for compiling some python packages if any)
RUN apt-get update && apt-get install -y \
    build-essential \
    libmariadb-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

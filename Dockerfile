# ✅ Single image: based on Node, add Python manually
FROM node:20-bullseye

# Install Python + pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY LoginBackend/requirements.txt /tmp/requirements.txt
RUN pip3 install --no-cache-dir -r /tmp/requirements.txt

# Copy project files
WORKDIR /app
COPY . .

# Ensure the shell script is executable
RUN chmod +x /app/build_and_deploy.sh

# Expose FastAPI port
EXPOSE 8000

# Run the script
ENTRYPOINT ["bash", "/app/build_and_deploy.sh"]

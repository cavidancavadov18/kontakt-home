FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CATALOG_PATH=/catalog/catalog.json \
    VARIANTS_PATH=/catalog/phone-variants.json \
    STORES_PATH=/app/data/stores.json \
    KH_DB_DIR=/data/db

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY data ./data

RUN mkdir -p /data/db /catalog

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

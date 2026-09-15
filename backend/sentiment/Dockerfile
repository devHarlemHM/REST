FROM python:3.10-slim

WORKDIR /sentiment

COPY requirements.txt .
RUN pip install --no-cache-dir \
      --extra-index-url https://download.pytorch.org/whl/cpu \
      torch==2.5.1+cpu && \
    pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

ARG SENTIMENT_PORT
ENV SENTIMENT_PORT=${SENTIMENT_PORT}
EXPOSE ${SENTIMENT_PORT}

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $SENTIMENT_PORT"]

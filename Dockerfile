FROM duffn/python-poetry:3.9-slim

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-root

COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN apt install -y netcat-traditional
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

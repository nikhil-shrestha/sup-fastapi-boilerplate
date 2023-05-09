FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1

ENV PATH="$POETRY_HOME/bin:$PATH"

WORKDIR /app/


# Install Poetry
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=${POETRY_HOME} python3 - && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Copy poetry.lock* in case it doesn't exist in the repo
COPY ./pyproject.toml ./poetry.lock* /app/

ARG ENVIRONMENT=test
RUN bash -c "if [ $ENVIRONMENT == "dev" ] || [ $ENVIRONMENT == "prod" ] ; then poetry install --no-root ; else poetry install --no-root --no-dev ; fi"

COPY . /app/

COPY ./startup.sh /app/

RUN chmod +x /app/startup.sh

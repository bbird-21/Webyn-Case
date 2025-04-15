# 🕸️ Webyn Case - Traffic Dashboard

Run a modern website traffic dashboard powered by Angular (frontend) and Symfony (backend API), containerized with Docker and Docker Compose.


![Screenshot From 2025-04-09 22-17-02](https://github.com/user-attachments/assets/32dfe0bf-f0af-4b5e-aa49-6537784d32f6)


---

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Docker](https://docs.docker.com/get-docker/) & Docker Compose (Usually included with Docker Desktop)
*   `make` command-line utility (Common on Linux/macOS, installable on Windows e.g., via Chocolatey or WSL)
*   `git` command-line utility
*   `openssl` (usually pre-installed on most systems) - Used by `make` to generate a secure key.

---

## 🚀 Getting Started

Follow these simple steps to get the project running locally:

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:bbird-21/Webyn-Case.git
    ```

2.  **Navigate into the project directory:**
    ```bash
    cd Webyn-Case
    ```

3.  **Set up environment files:**
    ```bash
    make env
    ```
    *(See explanation below)*

4.  **Build and run the application:**
    ```bash
    make all
    ```
    *(See explanation below)*

5.  **Access the dashboard:**
    Once the containers are built and running (this might take a minute the first time), open your web browser and navigate to:
    [`http://localhost:4200`](http://localhost:4200)

    You should see the traffic dashboard interface!

---

## ✨ Make Commands Explained

This project uses a `Makefile` to automate common tasks:

*   **`make env`**:
    *   This command prepares the necessary environment configuration files.
    *   It copies the template files (`.env.example` and `traffic-api/.env.example`) to `.env` and `traffic-api/.env` respectively (only if they don't already exist).
    *   It automatically appends your local user ID (`HOST_UID`) and group ID (`HOST_GID`) to the root `.env` file. This is crucial for Docker to correctly set file permissions inside the containers, avoiding permission errors with mounted files.
    *   It generates a cryptographically secure random `APP_SECRET` using `openssl` and injects it into the backend's `traffic-api/.env` file, replacing the placeholder.

*   **`make all`**:
    *   This is the primary command to build and launch the entire application stack using `docker-compose`.
    *   It builds the Docker images for the Angular frontend (`dashboard` service) and the Symfony backend (`traffic-api` service) if they haven't been built yet or if their source files have changed.
    *   It starts all the required containers (frontend, backend, database).
    *   During the backend container's startup, essential setup tasks defined in `traffic-api/run.sh` (like `composer install`, database migrations, and fixture loading) are automatically executed.

---

That's all ! Enjoy exploring the traffic dashboard ! 🥳

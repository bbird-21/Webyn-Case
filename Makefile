.DEFAULT_GOAL := help

# Colors
_END		= \033[0m
_INFO		= \033[1;33m
_BUILD		= \033[1;32m
_REMOVE		= \033[1;31m

# Define variables for file paths
TRAFFIC_API_DIR := ./traffic-api
ROOT_ENV_EXAMPLE := .env.example
ROOT_ENV := .env
BACKEND_ENV_EXAMPLE := $(TRAFFIC_API_DIR)/.env.example
BACKEND_ENV := $(TRAFFIC_API_DIR)/.env
SECRET=$$(openssl rand -hex 32)

.PHONY: all
all: build up

env_setup: setup-compose-env setup-backend-env

.PHONY: build
build:
#	@mkdir -p ./db/postgres
	@docker compose build

.PHONY: up
up:
	@docker compose up -d

.PHONY: down
down:
	@docker compose down

.PHONY: clean
clean:
	@docker compose down --rmi all --volumes --remove-orphans
	@docker stop $(docker ps -qa) 2>/dev/null || true
	@docker rm $(docker ps -qa) 2>/dev/null || true
	@docker rmi $(docker images -qa) 2>/dev/null || true
	@docker volume rm $(docker volume ls -q) 2>/dev/null || true
	@docker network rm $(docker network ls -q) 2>/dev/null || true

.PHONY: reload
reload: down up

.PHONY: re
re: clean all

.PHONY: info
info:
	@echo "${_INFO}======================= COMPOSE ========================${_END}"
	@docker compose ps
	@echo "\n${_INFO}======================== IMAGES ========================${_END}"
	@docker images
	@echo "\n${_INFO}====================== CONTAINERS ======================${_END}"
	@docker ps -a
	@echo "\n${_INFO}======================== VOLUMES =======================${_END}"
	@docker volume ls
	@echo "\n${_INFO}======================== NETWORKS ======================${_END}"
	@docker network ls

.PHONY: help
help:
	@echo "Usage: make [OPTION]"
	@echo "Options:"
	@echo "  all       Build and run containers"
	@echo "  build     Build containers"
	@echo "  up        Run containers"
	@echo "  down      Stop containers"
	@echo "  clean     Stop and remove containers, images, volumes and networks"
	@echo "  fclean    Stop and remove containers, images, volumes and networks"
	@echo "            and clean all files"
	@echo "  re        Run fclean and all"
	@echo "  info      Show containers, images, volumes and networks"
	@echo "  help      Show this help"

# Sets up the root .env file for Docker Compose (UID/GID)
setup-compose-env:
	@echo "⚙️  Setting up Docker Compose environment file..."
	@if [ ! -f "$(ROOT_ENV)" ]; then \
		cp "$(ROOT_ENV_EXAMPLE)" "$(ROOT_ENV)"; \
		echo "HOST_UID=$$(id -u)" >> "$(ROOT_ENV)"; \
		echo "HOST_GID=$$(id -g)" >> "$(ROOT_ENV)"; \
		echo "    Copied $(ROOT_ENV_EXAMPLE) to $(ROOT_ENV) and added HOST_UID/HOST_GID."; \
	else \
		echo "    $(ROOT_ENV) already exists, skipping creation."; \
		# Check if HOST_UID/GID are missing and add if needed (optional enhancement) \
		if ! grep -q "^HOST_UID=" "$(ROOT_ENV)"; then echo "HOST_UID=$$(id -u)" >> "$(ROOT_ENV)"; echo "    Added missing HOST_UID."; fi; \
		if ! grep -q "^HOST_GID=" "$(ROOT_ENV)"; then echo "HOST_GID=$$(id -g)" >> "$(ROOT_ENV)"; echo "    Added missing HOST_GID."; fi; \
	fi

# Sets up the backend .env file (copy, generate APP_SECRET)
setup-backend-env:
	@echo "⚙️  Setting up backend environment file..."
	@if [ ! -f "$(BACKEND_ENV)" ]; then \
		cp "$(BACKEND_ENV_EXAMPLE)" "$(BACKEND_ENV)"; \
		echo "    Copied $(BACKEND_ENV_EXAMPLE) to $(BACKEND_ENV)."; \
		# Replace the placeholder using the generated secret (requires SECRET variable) \
		# Note the use of different sed delimiter (#) and $$ for shell variable expansion within Make \
		sed -i'' -e "s#^APP_SECRET=.*#APP_SECRET=$(SECRET)#" "$(BACKEND_ENV)"; \
		echo "    Updated $(BACKEND_ENV) with generated APP_SECRET."; \
	else \
		echo "    $(BACKEND_ENV) already exists, checking APP_SECRET..."; \
		if grep -q "APP_SECRET=replace_with_a_secure_random_key" "$(BACKEND_ENV)" || ! grep -q "^APP_SECRET=" "$(BACKEND_ENV)"; then \
			echo "    Placeholder or missing APP_SECRET found, updating..."; \
			sed -i'' -e "s#^APP_SECRET=.*#APP_SECRET=$(SECRET)#" "$(BACKEND_ENV)"; \
			echo "    Updated $(BACKEND_ENV) with generated APP_SECRET."; \
		else \
			echo "    APP_SECRET already seems set in $(BACKEND_ENV)."; \
		fi \
	fi

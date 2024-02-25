SERVICE_NAME=invoices

.PHONY: clean
clean: ## Clean the artifact directory
	rm -rf ./target

.PHONY: build
build: ## Build the image.
	DOCKER_BUILDKIT=1 docker buildx build --build-context root-src=../../ --platform linux/amd64 --target export . --output target

.PHONY: help
help: ## Display this help section
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: test
test: ## Runs the python tests
	poetry run pytest

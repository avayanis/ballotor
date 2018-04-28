# Version key/value should be on his own line
PACKAGE_VERSION=$(shell node -p "require('./package.json').version")
PACKAGE_NAME=$(shell node -p "require('./package.json').name")
CONTAINER_NAMESPACE=ballotor-api
REPO_URL=837938074632.dkr.ecr.us-west-1.amazonaws.com/ballotor-api
DOCKER_REPO=$(REPO_URL)/$(CONTAINER_NAMESPACE)

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

# DOCKER TASKS
# Build the container
build: build-app ## Build the container
	@echo 'Building container $(PACKAGE_NAME):$(PACKAGE_VERSION)'

	docker build --rm -f Dockerfile -t $(PACKAGE_NAME):$(PACKAGE_VERSION) .

build-app: clean ## Build app dir
	@echo 'Building application'
	npm run dev:build

build-nc: build-app ## Build the container without caching
	docker build --no-cache -t $(PACKAGE_NAME):$(PACKAGE_VERSION) .

clean:
	@echo 'Cleaning up build directories'
	rm -rf dist

run: build ## Run container in development mode
	docker run -it $(PACKAGE_NAME):$(PACKAGE_VERSION)

release: build-nc publish ## Make a release by building and publishing the `{version}` ans `latest` tagged containers to ECR

# Docker publish
publish: repo-login publish-latest publish-version ## Publish the `{version}` ans `latest` tagged containers to ECR

publish-latest: tag-latest ## Publish the `latest` taged container to ECR
	@echo 'publish latest to $(PACKAGE_VERSION) to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(PACKAGE_NAME):latest

publish-version: tag-version ## Publish the `{version}` taged container to ECR
	@echo 'publish $(PACKAGE_VERSION) to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(PACKAGE_NAME):$(PACKAGE_VERSION)

tag: tag-latest tag-version ## Generate container tags for the `{version}` and `latest` tags

tag-latest: ## Generate container `{version}` tag
	@echo 'create tag latest'
	docker tag $(PACKAGE_NAME):$(PACKAGE_VERSION) $(DOCKER_REPO)/$(PACKAGE_NAME):latest

tag-version: ## Generate container `latest` tag
	@echo 'create tag $(PACKAGE_VERSION)'
	docker tag $(PACKAGE_NAME):$(PACKAGE_VERSION) $(DOCKER_REPO)/$(PACKAGE_NAME):$(PACKAGE_VERSION)

repo-login:
	@eval $(shell aws ecr get-login --no-include-email --region us-west-1)
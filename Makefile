.DEFAULT_GOAL := help

.PHONY: start
start: ## Runs the full application stack locally
	@docker-compose up

.PHONY: test
test: ## Run automated tests
	@docker-compose run bot test

.PHONY: test-watch
test-watch: ## Run automated tests and re-run tests automatically on changed files
	@docker-compose run bot test --watchAll

.PHONY: sh-bot
sh-bot: ## Open a shell in the bot docker image
	@docker-compose run --entrypoint sh bot
	@echo
	@echo If you have just made changes to dependencies, remember to rebuild the
	@echo docker image by running \\033[33mmake rebuild\\033[0m or the changes won’t take effect.

.PHONY: rebuild
rebuild: ## Rebuild docker images
	@docker-compose build

.PHONY: clean
clean: ## Reset docker and clear temporary files
	@rm -rf ./node_modules
	@docker-compose down

.PHONY: help
help:
	@echo "Usage: make [task]\n\nAvailable tasks:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-10s\033[0m %s\n", $$1, $$2}'

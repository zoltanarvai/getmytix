.PHONY: plan-prod
plan-prod:
	terraform workspace select prod
	terraform plan -var-file="prod.tfvars"

.PHONY: apply-prod
apply-prod:
	terraform workspace select prod
	terraform apply -var-file="prod.tfvars" -auto-approve && terraform output -json > outputs.json

.PHONY: destroy-prod
destroy-prod:
	terraform workspace select prod
	terraform destroy -var-file="prod.tfvars" -auto-approve

.PHONY: plan-dev
plan-dev:
	terraform workspace select dev
	terraform plan -var-file="dev.tfvars"

.PHONY: apply-dev
apply-dev:
	terraform workspace select dev
	terraform apply -var-file="dev.tfvars" -auto-approve && terraform output -json > outputs.json

.PHONY: destroy-dev
destroy-dev:
	terraform workspace select dev
	terraform destroy -var-file="dev.tfvars" -auto-approve


.PHONY: help
help: ## Display this help section
	@grep -E
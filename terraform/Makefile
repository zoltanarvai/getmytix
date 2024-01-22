.PHONY: plan-prod
plan-prod:
	terraform plan -var-file="prod.tfvars"

.PHONY: apply-prod
apply-prod:
	terraform apply -var-file="prod.tfvars" -auto-approve && terraform output -json > outputs.json

.PHONY: destroy-prod
destroy-prod:
	terraform destroy -var-file="prod.tfvars" -auto-approve

.PHONY: help
help: ## Display this help section
	@grep -E
.DEFAULT_GOAL := run
nvm:
	export NVM_DIR=~/.nvm
	. /usr/local/opt/nvm/nvm.sh; \
	nvm use stable

run: nvm ## Run the app locally
	node server/app.js

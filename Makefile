.PHONY: all build fully_local_dev_start

BRANCH := $(shell git rev-parse --abbrev-ref HEAD)


all: build


build:
	docker build -t tower-analytics-frontend:${BRANCH} .

fully_local_dev_start:
	tmux new-session -d -s aa 'exec npm start'
	tmux select-window -t aa:0
	tmux split-window -v "cd ../tower-analytics-backend && exec make ui"
	tmux split-window -v "cd ../cloud-services-config && exec npx http-server -p 8889"
	tmux split-window -v "cd ../insights-proxy && SPANDX_CONFIG=../tower-analytics-frontend/config/fast-api.spandx.config.js exec scripts/run.sh"
	tmux split-window -h "exec npm run test_dev"
	tmux attach -t aa

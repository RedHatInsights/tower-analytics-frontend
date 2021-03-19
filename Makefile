.PHONY: all build fully_local_dev_start

BRANCH := $(shell git rev-parse --abbrev-ref HEAD)


all: build


build:
	docker build -t tower-analytics-frontend:${BRANCH} .

fully_local_dev_start:
	tmux new-session -d -s aa "exec npm run test_dev"
	tmux select-window -t aa:0
	tmux split-window -h -p 20 "cd ../tower-analytics-backend && exec make ui"
	tmux select-window -t aa:0
	tmux split-window -v -p 70 "exec npm start"
	tmux select-pane -U
	tmux split-window -v "cd ../insights-proxy && SPANDX_CONFIG=../tower-analytics-frontend/config/fast-api.spandx.config.js exec scripts/run.sh"
	tmux split-window -v "cd ../cloud-services-config && exec npx http-server -p 8889"
	tmux select-pane -U
	tmux select-pane -U
	tmux resize-pane -U 5
	tmux select-pane -D
	tmux resize-pane -U 5
	tmux select-pane -D
	tmux resize-pane -U 5
	tmux select-pane -L
	tmux set mouse on
	tmux attach -t aa

.PHONY: all build fully_local_dev_start

BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
GIT_BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD)

REL_BACKEND_PATH ?= ../tower-analytics-backend
REL_PROXY_PATH ?= ../insights-proxy
REL_PROXY_CONFIG_PATH ?= ../tower-analytics-frontend/config/fast-api.spandx.config.js bash scripts/run.sh
REL_CRC_CONFIG_PATH ?= ../cloud-services-config


all: build


build:
	docker build -t tower-analytics-frontend:${BRANCH} .

fully_local_dev_start:
	tmux new-session -d -s aa "exec npm run test_dev"
	tmux select-window -t aa:0
	tmux split-window -h -p 20 "cd ${REL_BACKEND_PATH} && exec make ui"
	tmux select-window -t aa:0
	tmux split-window -v -p 70 "exec npm start"
	tmux select-pane -U
	tmux split-window -v "cd ${REL_PROXY_PATH} && SPANDX_CONFIG=${REL_PROXY_CONFIG_PATH}"
	tmux split-window -v "cd ${REL_CRC_CONFIG_PATH} && exec npx http-server -p 8889"
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

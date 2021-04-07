.PHONY: all build fully_local_dev_install_mac fully_local_dev_start

BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
GIT_BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD)

REL_BACKEND_PATH ?= ../automation-analytics-backend
REL_PROXY_PATH ?= ../insights-proxy
REL_PROXY_CONFIG_PATH ?= ../tower-analytics-frontend/config/fast-api.spandx.config.js
REL_CRC_CONFIG_PATH ?= ../cloud-services-config


all: build


build:
	docker build -t tower-analytics-frontend:${BRANCH} .

fully_local_dev_install_mac:
	brew install tmux

fully_local_dev_start:
	tmux new-session -d -s aa "cd ${REL_BACKEND_PATH} && exec make ui"
	tmux select-window -t aa:0
	tmux split-window -v -p 70 "exec npm start"
	tmux select-pane -U
	tmux split-window -v "cd ${REL_PROXY_PATH} && SPANDX_CONFIG=${REL_PROXY_CONFIG_PATH} bash scripts/run.sh"
	tmux split-window -v "cd ${REL_CRC_CONFIG_PATH} && exec npx http-server -p 8889"
	tmux select-pane -U
	tmux select-pane -U
	tmux resize-pane -U 5
	tmux select-pane -D
	tmux resize-pane -U 5
	tmux select-pane -D
	tmux resize-pane -U 5
	tmux select-pane -D
	tmux set mouse on
	tmux attach -t aa

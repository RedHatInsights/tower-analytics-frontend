.PHONY: all build fully_local_dev_install_mac start

BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
REL_BACKEND_PATH ?= ../automation-analytics-backend

all: build

build:
	docker build -t tower-analytics-frontend:${BRANCH} .

fully_local_dev_install_mac:
	brew install tmux

start:
	-tmux kill-session -t aa
	tmux new-session -d -s aa "cd ${REL_BACKEND_PATH} && exec make ui-with-rbac"
	tmux select-window -t aa:0
	tmux split-window -v -p 70 "exec npm run start:beta"
	tmux select-pane -U
	tmux split-window -v "exec npm run proxy:fullstack"
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

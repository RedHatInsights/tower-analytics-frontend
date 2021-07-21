.PHONY: all build start

BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
REL_BACKEND_PATH ?= ../automation-analytics-backend

all: build

build:
	docker build -t tower-analytics-frontend:${BRANCH} .

start:
	-tmux kill-session -t aa
	tmux new-session -d -s aa "cd ${REL_BACKEND_PATH} && exec make ui-with-rbac"
	tmux select-window -t aa:0
	tmux split-window -v -p 70 "exec npm start"
	tmux resize-pane -U 5
	tmux select-pane -D
	tmux set mouse on
	tmux attach -t aa

.PHONY: all build

BRANCH := $(shell git rev-parse --abbrev-ref HEAD)


all: build


build:
	docker build -t tower-analytics-frontend:${BRANCH} .


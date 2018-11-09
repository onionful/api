#!/usr/bin/env bash

# load .env variables
export $(cat .env | xargs)
export FUNCTION=$1

if [[ -z "$FUNCTION" ]]; then
    echo "Function name is not provided"
    exit 1
fi

npx sls deploy

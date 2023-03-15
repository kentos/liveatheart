#!/bin/bash

PACKAGES=$(npm audit --json | jq --raw-output '{vulnerabilities: .vulnerabilities} | .vulnerabilities[] | @base64')

for PACKAGE in $PACKAGES; do
  info="$(echo "$PACKAGE" | base64 -d)"
  # echo $INFO
  name="$(echo $info | jq --raw-output '.name')"
  severity="$(echo $info | jq --raw-output '.severity')"
  range="$(echo $info | jq --raw-output '.range')"
  is_direct="$(echo $info | jq --raw-output '.isDirect')"
  if [[ $is_direct == "true" ]]; then
    echo "$name - $severity - $range"
  fi
done
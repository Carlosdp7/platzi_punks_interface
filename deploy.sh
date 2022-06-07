#!/bin/bash

cd ./build
FILES=$(find * -type f | awk -v q="'" '{print " -F " q "file=@\"" $0 "\";filename=\"" $0 "\"" q}')
curl -vv -X POST $FILES -u "2AGFkamGspbNNWJvbxj8gJQU3D1:2ba22f5f4d6fe9ac52dffdb2beffc472" "https://ipfs.infura.io:5001/api/v0/add?pin=true&recursive=true&wrap-with-directory=true&cid-version=1"
cd ..
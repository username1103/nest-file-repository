#!/bin/sh
echo "Init localstack"
awslocal s3 mb s3://test-bucket
awslocal s3api put-object --bucket test-bucket --key test-file.txt --body /data/test-file.txt

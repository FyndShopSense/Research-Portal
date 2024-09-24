#!/bin/sh
mkidr corpus_data
cd corpus_data
aws s3 cp --no-sign-request --recursive s3://ai2-s2-research-public/open-corpus/2020-05-27/ .
echo Files Fetched

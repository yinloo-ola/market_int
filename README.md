## Building Docker Image

- docker build --platform linux/amd64 -t us-west1-docker.pkg.dev/opt-intel/docker-repo/market-int:x.x.x .

## Pushing Docker Image

- docker push us-west1-docker.pkg.dev/opt-intel/docker-repo/market-int:x.x.x

## Create/Replace Cloud Run Job

- gcloud run jobs replace job.yaml

## Set default gcloud region

- gcloud config set run/region us-west1

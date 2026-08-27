## Repo map

- Domain crate + CLI pipeline: `crates/core`, `crates/cli` — see `AGENTS.md`
- Put-selling webapp (server + frontend): `crates/webapp/README.md`
  (local dev, Firebase auth setup, endpoints)
- Design record for the webapp effort: `.scratch/webapp/` (spec + tickets)

## Building Docker Image

- docker build --platform linux/amd64 -t us-west1-docker.pkg.dev/opt-intel/docker-repo/market-int:x.x.x .

## Pushing Docker Image

- docker push us-west1-docker.pkg.dev/opt-intel/docker-repo/market-int:x.x.x

## Create/Replace Cloud Run Job

- gcloud run jobs replace job.yaml

## Set default gcloud region

- gcloud config set run/region us-west1

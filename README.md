## Repo map

- Domain crate + CLI pipeline: `crates/core`, `crates/cli` — see `AGENTS.md`
- Put-selling webapp (server + frontend): `crates/webapp/README.md`
  (local dev, Firebase auth setup, endpoints)
- Design record for the webapp effort: `.scratch/webapp/` (spec + tickets)

## Building Docker Image

- `make docker-build tag=x.x.x` — builds the frontend + cross-compiles both
  binaries on the host (cargo zigbuild, linux/amd64), assembles the thin
  image, pushes it, and stamps `job.yaml`/`service.yaml`. One-time setup:
  `brew install zig && cargo install cargo-zigbuild`.

## Create/Replace Cloud Run Job

- gcloud run jobs replace job.yaml

## Set default gcloud region

- gcloud config set run/region us-west1

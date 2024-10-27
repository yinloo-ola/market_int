pull-quotes:
	RUST_LOG=debug cargo run -- pull-quotes /home/tianhai82/hobby/market_int/data/symbols.csv

pull-option-chain:
	RUST_LOG=debug cargo run -- pull-option-chain /home/tianhai82/hobby/market_int/data/symbols.csv

calculate-atr:
	RUST_LOG=debug cargo run -- calculate-atr /home/tianhai82/hobby/market_int/data/symbols.csv

publish-option-chain:
	RUST_LOG=debug cargo run -- publish-option-chain /home/tianhai82/hobby/market_int/data/symbols.csv

perform-all:
	RUST_LOG=debug cargo run -- perform-all /home/tianhai82/hobby/market_int/data/symbols.csv

docker-build:
	docker build -t us-west1-docker.pkg.dev/opt-intel/docker-repo/market-int:$(tag) .
	docker push us-west1-docker.pkg.dev/opt-intel/docker-repo/market-int:$(tag)
	@echo "remember to update job.yaml!!"

gcloud-job:
	gcloud run jobs replace job.yaml

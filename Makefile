# Makefile for market_int project
# All commands use the symbols.csv file by default

# Pull quotes for specified symbols
pull-quotes:
	RUST_LOG=debug cargo run -- pull-quotes /home/tianhai82/hobby/market_int/data/symbols.csv

# Calculate Average True Range (ATR)
calculate-atr:
	RUST_LOG=debug cargo run -- calculate-atr /home/tianhai82/hobby/market_int/data/symbols.csv

# Calculate Maximum Drop for 5-day period
calculate-maxdrop-5:
	RUST_LOG=debug cargo run -- calculate-max-drop /home/tianhai82/hobby/market_int/data/symbols.csv 5

# Calculate Maximum Drop for 20-day period
calculate-maxdrop-20:
	RUST_LOG=debug cargo run -- calculate-max-drop /home/tianhai82/hobby/market_int/data/symbols.csv 20

# Calculate Sharpe Ratio
calculate-sharpe:
	RUST_LOG=debug cargo run -- calculate-sharpe-ratio /home/tianhai82/hobby/market_int/data/symbols.csv

# Pull option chain data with 5-day expiry
pull-option-chain-5day:
	RUST_LOG=debug cargo run -- pull-option-chain5-day /home/tianhai82/hobby/market_int/data/symbols.csv

# Pull option chain data with 20-day expiry
pull-option-chain-20day:
	RUST_LOG=debug cargo run -- pull-option-chain20-day /home/tianhai82/hobby/market_int/data/symbols.csv

# Legacy target - maps to 5-day option chain
pull-option-chain:
	RUST_LOG=debug cargo run -- pull-option-chain5-day /home/tianhai82/hobby/market_int/data/symbols.csv

# Publish option chain to telegram
publish-option-chain:
	RUST_LOG=debug cargo run -- publish-option-chain /home/tianhai82/hobby/market_int/data/symbols.csv

# Perform all operations (quotes, ATR, Sharpe, option chains)
perform-all:
	RUST_LOG=debug cargo run -- perform-all /home/tianhai82/hobby/market_int/data/symbols.csv

# Test Tiger API with comma-separated symbols (e.g., make test-tiger SYMBOLS="AAPL,MSFT,GOOGL")
test-tiger:
	RUST_LOG=debug cargo run -- test-tiger "$(SYMBOLS)"

# Build the project
check:
	cargo check

build:
	cargo build

build-release:
	cargo build --release

# Run tests
test:
	cargo test

# Clean build artifacts
clean:
	cargo clean

# Docker operations
docker-build:
	docker build -t us-west1-docker.pkg.dev/opt-intel/docker-repo/market-int:$(tag) .
	docker push us-west1-docker.pkg.dev/opt-intel/docker-repo/market-int:$(tag)
	@echo "remember to update job.yaml!!"

# Google Cloud operations
gcloud-job:
	gcloud run jobs replace job.yaml

# Help target
help:
	@echo "Available targets:"
	@echo "  pull-quotes          - Pull quotes for symbols"
	@echo "  calculate-atr        - Calculate ATR"
	@echo "  calculate-maxdrop-5  - Calculate 5-day max drop"
	@echo "  calculate-maxdrop-20 - Calculate 20-day max drop"
	@echo "  calculate-sharpe     - Calculate Sharpe ratio"
	@echo "  pull-option-chain-5day  - Pull 5-day option chains"
	@echo "  pull-option-chain-20day - Pull 20-day option chains"
	@echo "  pull-option-chain    - Legacy: same as pull-option-chain-5day"
	@echo "  publish-option-chain - Publish option chains to Telegram"
	@echo "  perform-all          - Run all operations"
	@echo "  test-tiger SYMBOLS=\"AAPL,MSFT\" - Test Tiger API"
	@echo "  check                - Check compilation"
	@echo "  build                - Build debug version"
	@echo "  build-release        - Build release version"
	@echo "  test                 - Run tests"
	@echo "  clean                - Clean build artifacts"
	@echo "  docker-build         - Build and push Docker image"
	@echo "  gcloud-job           - Update Google Cloud job"
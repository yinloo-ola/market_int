pull-quotes:
	RUST_LOG=debug cargo run -- pull-quotes /home/tianhai82/hobby/market_int/data/symbols.csv

calculate-atr:
	RUST_LOG=debug cargo run -- calculate-atr /home/tianhai82/hobby/market_int/data/symbols.csv

pull-option-chain:
	RUST_LOG=debug cargo run -- pull-option-chain /home/tianhai82/hobby/market_int/data/symbols.csv

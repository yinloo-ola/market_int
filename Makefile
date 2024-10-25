pull-quotes:
	RUST_LOG=debug cargo run -- pull-quotes /home/tianhai82/hobby/market_int/data/symbols.csv

pull-option-chain:
	RUST_LOG=debug cargo run -- pull-option-chain /home/tianhai82/hobby/market_int/data/symbols.csv

publish-option-chain:
	RUST_LOG=debug cargo run -- publish-option-chain /home/tianhai82/hobby/market_int/data/symbols.csv

run:
	RUST_LOG=debug cargo run -- pull-quotes /home/tianhai82/hobby/market_int/data/symbols.csv
	RUST_LOG=debug cargo run -- pull-option-chain /home/tianhai82/hobby/market_int/data/symbols.csv
####################################################################################################
## Builder
####################################################################################################
FROM rust:latest AS builder

ENV USER=market_int
ENV UID=10001

RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    "${USER}"

WORKDIR /market_int

# 1. Cache dependencies: copy only manifests first (virtual workspace:
#    root manifest + one per member crate)
COPY Cargo.toml Cargo.lock ./
COPY crates/core/Cargo.toml crates/core/
COPY crates/cli/Cargo.toml crates/cli/
COPY crates/webapp/Cargo.toml crates/webapp/

# Dummy sources so cargo can resolve and compile dependencies, then build
# only those dependencies into its own cacheable layer
RUN mkdir -p crates/core/src crates/cli/src crates/webapp/src \
 && echo "" > crates/core/src/lib.rs \
 && echo "fn main() {}" > crates/cli/src/main.rs \
 && echo "fn main() {}" > crates/webapp/src/main.rs

RUN cargo build --release --features bundled-sqlite -p market_int

RUN rm -rf crates

# 2. Now copy the real source — dependency layer is cached unless manifests change
COPY crates ./crates

# Touch sources so cargo sees newer files than the cached dummy ones
RUN touch crates/cli/src/main.rs

RUN cargo build --release --features bundled-sqlite -p market_int

RUN strip -s /market_int/target/release/market_int

####################################################################################################
## Final image
####################################################################################################
FROM gcr.io/distroless/cc

COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

WORKDIR /market_int

COPY --from=builder /market_int/target/release/market_int ./

USER market_int:market_int

ENTRYPOINT ["/market_int/market_int"]

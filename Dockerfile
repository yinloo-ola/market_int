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

# 1. Cache dependencies: copy only manifests first
COPY Cargo.toml Cargo.lock ./

# Create a dummy main.rs so cargo can resolve and compile dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release --features bundled-sqlite && rm -rf src

# 2. Now copy the real source — dependency layer is cached unless Cargo.toml/Cargo.lock change
COPY src ./src

# Touch main.rs so cargo sees a newer file than the cached one
RUN touch src/main.rs

RUN cargo build --release --features bundled-sqlite

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

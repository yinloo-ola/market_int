####################################################################################################
## Frontend (node) — vite + Solid build (ticket 08 verdict; solid 1.9 per the §6.1 fallback)
####################################################################################################
FROM node:22-slim AS frontend
WORKDIR /build
COPY crates/webapp/frontend/package.json crates/webapp/frontend/package-lock.json ./
RUN npm ci
COPY crates/webapp/frontend/ ./
# Vite emits stable names (index.html + assets/app.js|css) into /build/dist —
# consumed by include_str!/include_bytes! in crates/webapp/src/assets.rs.
RUN npm run build

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
#    root manifest + one per member crate), then dummy sources so cargo can
#    resolve and compile every dependency into its own cacheable layer.
COPY Cargo.toml Cargo.lock ./
COPY crates/core/Cargo.toml crates/core/
COPY crates/cli/Cargo.toml crates/cli/
COPY crates/webapp/Cargo.toml crates/webapp/

RUN mkdir -p crates/core/src crates/cli/src crates/webapp/src \
 && echo "" > crates/core/src/lib.rs \
 && echo "fn main() {}" > crates/cli/src/main.rs \
 && echo "fn main() {}" > crates/webapp/src/main.rs \
 && cargo build --release --workspace --features market_int/bundled-sqlite \
 && rm -rf crates

# 2. Now copy the real source — dependency layer is cached unless manifests change
COPY crates ./crates

# Touch sources so cargo sees newer files than the cached dummy ones
RUN touch crates/cli/src/main.rs crates/core/src/lib.rs

# Bring in the built frontend so the webapp's include_str! embeds resolve
COPY --from=frontend /build/dist crates/webapp/frontend/dist

RUN cargo build --release --workspace --features market_int/bundled-sqlite

RUN strip -s /market_int/target/release/market_int /market_int/target/release/market_int_webapp

####################################################################################################
## Final image — both binaries, CLI entrypoint unchanged (the Service overrides command:)
####################################################################################################
FROM gcr.io/distroless/cc

COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

WORKDIR /market_int

COPY --from=builder /market_int/target/release/market_int ./
COPY --from=builder /market_int/target/release/market_int_webapp ./

USER market_int:market_int

ENTRYPOINT ["/market_int/market_int"]

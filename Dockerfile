####################################################################################################
## Builder
####################################################################################################
FROM rust:latest AS builder

RUN update-ca-certificates

# Create appuser
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

COPY ./ .

# We no longer need to use the x86_64-unknown-linux-musl target
RUN cargo build --release

RUN strip -s /market_int/target/release/market_int

####################################################################################################
## Final image
####################################################################################################
FROM gcr.io/distroless/cc

# Import from builder.
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

WORKDIR /market_int

# Copy our build
COPY --from=builder /market_int/target/release/market_int ./

# Use an unprivileged user.
USER market_int:market_int

ENTRYPOINT ["/market_int/market_int"]
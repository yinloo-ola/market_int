####################################################################################################
## Runtime image — thin by design. The frontend (vite/Solid) and the Rust binaries are built on
## the HOST by `make docker-build`: cargo zigbuild cross-compiles linux/amd64 natively (zig is the
## linker), and the webapp embeds frontend/dist via include_str! at compile time. This file only
## assembles the image.
####################################################################################################
# Static passwd/group for the uid-10001 runtime user (same uid the old builder-stage adduser
# produced — kept so existing GCS artifacts stay accessible). busybox is only here because
# distroless has no shell to generate them.
FROM busybox:1.36 AS files
RUN echo "root:x:0:0:root:/root:/sbin/nologin" > /etc/passwd \
 && echo "nobody:x:65534:65534:nobody:/nonexistent:/sbin/nologin" >> /etc/passwd \
 && echo "market_int:x:10001:10001::/nonexistent:/sbin/nologin" >> /etc/passwd \
 && echo "root:x:0:" > /etc/group \
 && echo "nobody:x:65534:" >> /etc/group \
 && echo "market_int:x:10001:" >> /etc/group

# Pinned by digest (bump deliberately); --platform linux/amd64 on the build selects the amd64 child.
FROM gcr.io/distroless/cc@sha256:9b615fff20e1a4fad29c2b30562580b212c7dd5e2225236735cca0070ed11c78

COPY --from=files /etc/passwd /etc/passwd
COPY --from=files /etc/group /etc/group

WORKDIR /market_int

COPY target/x86_64-unknown-linux-gnu/release/market_int ./
COPY target/x86_64-unknown-linux-gnu/release/market_int_webapp ./

USER market_int:market_int

ENTRYPOINT ["/market_int/market_int"]

default:
  just build-posts build-server

build-posts:
  just posts/
  mkdir server/client/build > /dev/null 2>&1 || true
  find posts -type d -not -path posts -exec cp -r {} server/client/build \;

build-server:
  just server/

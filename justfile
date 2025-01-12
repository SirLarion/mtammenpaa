default:
  just build-posts build-server

build-posts:
  just posts/
  (mkdir server/build > /dev/null 2>&1 || true) && cp posts/html/* server/client/build 

build-server:
  just server/

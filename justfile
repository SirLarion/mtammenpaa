export TAR_FILE := "production.tar.gz"

default:
  just build-posts
  just server/
  just dev

dev:
  just server/start

build-posts:
  just posts/
  mkdir server/client/build > /dev/null 2>&1 || true
  find posts -type d -not -path posts/build -exec cp -r {} server/client/build \;
  rm -r posts/build


build-tar:
  just build-posts
  tar -czf $TAR_FILE -C server client migrations src templates \
    .env.production db.sqlite Cargo.lock Cargo.toml

deploy target:
  #!/usr/bin/env bash
  DIR="apps/m_tammenpaa"

  # Exit early if anything fails
  set -e

  [[ -z {{target}} ]] && echo "No target specified, exiting" && exit 1

  # Run in project root
  just build-tar

  read -s -p "Server password: " PASSWD
  export SSHPASS="$PASSWD"

  echo "Attempting to deploy..."
  sshpass -v -e scp $TAR_FILE {{target}}:~/$DIR

  sshpass -e ssh {{target}} "cd $DIR; ./stop; tar -xf $TAR_FILE; \
    cargo build --release; ./start"

  unset SSHPASS

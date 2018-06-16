#!/bin/sh
USER=seanpwstanley
HOST=ps10514.dreamhost.com
#DIR=/staging.casualrp.com   # might sometimes be empty!
DIR=/casualrp.com
PATREON_DIR=/podcast.casualrp.com/patreon
HUGO_ENV="production"

rm -rf /public
hugo && rsync -avz --delete public/ ${USER}@${HOST}:~/${DIR}
# rm -rf /public
# hugo --config patron-config.toml && rsync -avz --delete public/ ${USER}@${HOST}:~/${PATREON_DIR}
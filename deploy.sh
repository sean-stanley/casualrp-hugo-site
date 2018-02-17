#!/bin/sh
USER=seanpwstanley
HOST=ps10514.dreamhost.com
DIR=/staging.casualrp.com   # might sometimes be empty!

hugo -D && rsync -avz --delete public/ ${USER}@${HOST}:~/${DIR}

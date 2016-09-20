#!/bin/bash

USRID=$(stat -c '%u' .)
GRPID=$(stat -c '%g' .)
HOME=/home/dummy

if ! getent group $GRPID; then
  groupadd -f -g $GRPID dummy || exit 1
fi

if ! getent passwd $USRID; then
  useradd -m -g $GRPID -N -u $USRID -s /bin/bash dummy || exit 1
  echo "dummy ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
fi

# DBUS_SESSION_BUS_ADDRESS necessary to make Chrome not stall
# see https://github.com/SeleniumHQ/docker-selenium/issues/87
exec sudo -sE -u \#$USRID \
  LBSERVER_HOST=$(ip route show 0.0.0.0/0 | grep -Eo 'via \S+' | awk '{ print $2 }') \
  DBUS_SESSION_BUS_ADDRESS=/dev/null \
  $@

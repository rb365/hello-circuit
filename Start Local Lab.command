#!/bin/bash
# Start this project locally. This script does not publish or upload anything.
cd -- "$(dirname -- "$0")" || exit 1
printf 'Hello Circuit — local preview\nKeep this window open. Press Ctrl+C to stop.\n\n'
python3 -m http.server 4178 --bind 127.0.0.1 --directory dist &
lab_preview_pid=$!
trap 'kill "$lab_preview_pid" 2>/dev/null' EXIT INT TERM
if curl --fail --silent --output /dev/null --retry 4 --retry-connrefused --retry-delay 1 http://127.0.0.1:4178/; then
  open 'http://127.0.0.1:4178/'
  wait "$lab_preview_pid"
else
  printf 'The local preview did not start. Check that Python 3 is installed and port 4178 is available.\n'
  read -r -p 'Press Enter to close.' lab_close_response
fi

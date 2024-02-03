#!/bin/bash

# Generate the frontend client every minute in the background.
while true; do 
  sleep 60
  yarn generate-docker
done &

# Start the development server.
PORT=8080 HOST=0.0.0.0 yarn start

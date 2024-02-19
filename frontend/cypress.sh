#!/bin/bash

docker compose up --build -d

while ! docker compose logs frontend-test | grep "You can now view frontend in the browser"; do
    echo "Waiting for frontend to get ready..."
    sleep 10
done

while ! docker compose logs backend-test | grep "Application startup complete"; do
    echo "Waiting for backend to get ready..."
    sleep 10
done

docker compose run -T cypress yarn cypress run e2e

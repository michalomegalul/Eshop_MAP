#!/bin/sh
echo "Database is ready. ........................................................................................................................................................................................"

# Run migrations
poetry run flask db upgrade

# Start the application
exec poetry run gunicorn --timeout 120 -b :5000 --access-logfile - --error-logfile - "app:app"

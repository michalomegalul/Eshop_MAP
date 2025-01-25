#!/bin/sh
echo "Database is ready. ........................................................................................................................................................................................"

# Run migrations
poetry run flask db upgrade

# Start the application
exec poetry run gunicorn \
    --timeout 300 \
    -b :5000 \
    --workers 4 \
    --threads 4 \
    --access-logfile - \
    --access-logformat '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f
    %(a)s"' \
    --error-logfile - \
    --log-level debug \
    "app:app"
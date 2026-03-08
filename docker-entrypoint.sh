#!/bin/sh

# Generate runtime environment config
cat <<EOF > /app/public/env-config.js
window.__ENV__ = {
  API_BASE_URL: "${API_BASE_URL:-http://localhost:8000/api/v1}"
};
EOF

echo "Generated env-config.js with API_BASE_URL: ${API_BASE_URL:-http://localhost:8000/api/v1}"

# Start the application
exec "$@"

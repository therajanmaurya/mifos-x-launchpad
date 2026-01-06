#!/bin/bash
# Rebrand network configuration (BaseURL.kt)
# Modifies server URLs for the application
# NOTE: Server config is runtime only but we set default values for the build

set -e

CONFIG="$1"
SUBMODULE_PATH="$2"

if [ -z "$CONFIG" ] || [ -z "$SUBMODULE_PATH" ]; then
  echo "Error: Missing arguments"
  echo "Usage: $0 '<json-config>' '<submodule-path>'"
  exit 1
fi

# Extract server config if provided
# Note: serverConfig is runtime only, so we use defaults for the build
# Users will configure server URLs at runtime in their deployment

# Default values (Mifos demo server)
DEFAULT_PROTOCOL="https"
DEFAULT_HOST="demo.mifos.io"
DEFAULT_PORT="443"
DEFAULT_API_PATH="/fineract-provider/api/v1"

echo "  Note: Server config is runtime-configurable"
echo "  Setting default values for build:"
echo "    Protocol: $DEFAULT_PROTOCOL"
echo "    Host: $DEFAULT_HOST"
echo "    Port: $DEFAULT_PORT"
echo "    API Path: $DEFAULT_API_PATH"

# Find BaseURL.kt files
BASEURL_FILES=$(find "$SUBMODULE_PATH" -name "BaseURL.kt" -o -name "BaseUrl.kt" -o -name "NetworkConfig.kt" 2>/dev/null || true)

if [ -z "$BASEURL_FILES" ]; then
  echo "  Warning: No BaseURL.kt files found - skipping network rebrand"
  exit 0
fi

# Process each BaseURL.kt file
echo "$BASEURL_FILES" | while read -r file; do
  if [ -n "$file" ] && [ -f "$file" ]; then
    echo "  Processing: $file"

    # Create backup
    cp "$file" "${file}.bak"

    # Update PROTOCOL_HTTPS constant
    if grep -q 'PROTOCOL_HTTPS\s*=' "$file"; then
      sed -i "s|const val PROTOCOL_HTTPS\s*=\s*\"[^\"]*\"|const val PROTOCOL_HTTPS = \"$DEFAULT_PROTOCOL\"|g" "$file"
      echo "    - Updated PROTOCOL_HTTPS"
    fi

    # Update API_ENDPOINT constant
    if grep -q 'API_ENDPOINT\s*=' "$file"; then
      sed -i "s|const val API_ENDPOINT\s*=\s*\"[^\"]*\"|const val API_ENDPOINT = \"$DEFAULT_HOST\"|g" "$file"
      echo "    - Updated API_ENDPOINT"
    fi

    # Update API_PATH constant
    if grep -q 'API_PATH\s*=' "$file"; then
      sed -i "s|const val API_PATH\s*=\s*\"[^\"]*\"|const val API_PATH = \"$DEFAULT_API_PATH\"|g" "$file"
      echo "    - Updated API_PATH"
    fi

    # Update BASE_URL if it's a full URL
    if grep -q 'BASE_URL\s*=' "$file"; then
      FULL_URL="${DEFAULT_PROTOCOL}://${DEFAULT_HOST}${DEFAULT_API_PATH}"
      sed -i "s|const val BASE_URL\s*=\s*\"[^\"]*\"|const val BASE_URL = \"$FULL_URL\"|g" "$file"
      echo "    - Updated BASE_URL"
    fi

    # Update DEMO_SERVER_URL if exists
    if grep -q 'DEMO_SERVER_URL\s*=' "$file"; then
      FULL_URL="${DEFAULT_PROTOCOL}://${DEFAULT_HOST}${DEFAULT_API_PATH}"
      sed -i "s|const val DEMO_SERVER_URL\s*=\s*\"[^\"]*\"|const val DEMO_SERVER_URL = \"$FULL_URL\"|g" "$file"
      echo "    - Updated DEMO_SERVER_URL"
    fi
  fi
done

echo "  Network configuration updated successfully"

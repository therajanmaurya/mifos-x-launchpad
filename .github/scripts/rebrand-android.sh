#!/bin/bash
# Rebrand Android resources (strings.xml)
# Modifies app name, organization name, and other user-visible strings

set -e

CONFIG="$1"
SUBMODULE_PATH="$2"

if [ -z "$CONFIG" ] || [ -z "$SUBMODULE_PATH" ]; then
  echo "Error: Missing arguments"
  echo "Usage: $0 '<json-config>' '<submodule-path>'"
  exit 1
fi

# Extract values from config
DISPLAY_NAME=$(echo "$CONFIG" | jq -r '.project.displayName')
ORG_NAME=$(echo "$CONFIG" | jq -r '.organization.name')
ORG_EMAIL=$(echo "$CONFIG" | jq -r '.organization.email')
ORG_WEBSITE=$(echo "$CONFIG" | jq -r '.organization.website // ""')
ORG_PHONE=$(echo "$CONFIG" | jq -r '.organization.phone // ""')
DESCRIPTION=$(echo "$CONFIG" | jq -r '.project.description // ""')

echo "  Display Name: $DISPLAY_NAME"
echo "  Organization: $ORG_NAME"

# Find all strings.xml files
STRINGS_FILES=$(find "$SUBMODULE_PATH" -name "strings.xml" -type f 2>/dev/null || true)

if [ -z "$STRINGS_FILES" ]; then
  echo "  Warning: No strings.xml files found - skipping Android rebrand"
  exit 0
fi

# Process each strings.xml file
echo "$STRINGS_FILES" | while read -r file; do
  if [ -n "$file" ] && [ -f "$file" ]; then
    echo "  Processing: $file"

    # Create backup
    cp "$file" "${file}.bak"

    # Update app_name
    if grep -q '<string name="app_name">' "$file"; then
      sed -i "s|<string name=\"app_name\">[^<]*</string>|<string name=\"app_name\">$DISPLAY_NAME</string>|g" "$file"
      echo "    - Updated app_name"
    fi

    # Update feature_about_app_name if exists
    if grep -q '<string name="feature_about_app_name">' "$file"; then
      sed -i "s|<string name=\"feature_about_app_name\">[^<]*</string>|<string name=\"feature_about_app_name\">$DISPLAY_NAME</string>|g" "$file"
      echo "    - Updated feature_about_app_name"
    fi

    # Update organization name if exists
    if grep -q '<string name="org_name">' "$file"; then
      sed -i "s|<string name=\"org_name\">[^<]*</string>|<string name=\"org_name\">$ORG_NAME</string>|g" "$file"
      echo "    - Updated org_name"
    fi

    # Update organization_name if exists
    if grep -q '<string name="organization_name">' "$file"; then
      sed -i "s|<string name=\"organization_name\">[^<]*</string>|<string name=\"organization_name\">$ORG_NAME</string>|g" "$file"
      echo "    - Updated organization_name"
    fi

    # Update contact email if exists
    if grep -q '<string name="contact_email">' "$file" && [ -n "$ORG_EMAIL" ]; then
      sed -i "s|<string name=\"contact_email\">[^<]*</string>|<string name=\"contact_email\">$ORG_EMAIL</string>|g" "$file"
      echo "    - Updated contact_email"
    fi

    # Update help_line_number if exists
    if grep -q '<string name="help_line_number">' "$file" && [ -n "$ORG_PHONE" ]; then
      sed -i "s|<string name=\"help_line_number\">[^<]*</string>|<string name=\"help_line_number\">$ORG_PHONE</string>|g" "$file"
      echo "    - Updated help_line_number"
    fi

    # Update website_url if exists
    if grep -q '<string name="website_url">' "$file" && [ -n "$ORG_WEBSITE" ]; then
      sed -i "s|<string name=\"website_url\">[^<]*</string>|<string name=\"website_url\">$ORG_WEBSITE</string>|g" "$file"
      echo "    - Updated website_url"
    fi

    # Update app_description if exists
    if grep -q '<string name="app_description">' "$file" && [ -n "$DESCRIPTION" ]; then
      sed -i "s|<string name=\"app_description\">[^<]*</string>|<string name=\"app_description\">$DESCRIPTION</string>|g" "$file"
      echo "    - Updated app_description"
    fi
  fi
done

echo "  Android resources updated successfully"

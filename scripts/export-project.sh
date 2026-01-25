#!/bin/bash

# MoonTV Project Export Script
# This script packages the project for migration to Vercel or other platforms.

echo "🚀 Starting MoonTV Project Export..."
echo "-----------------------------------"

# 1. Define required storage paths
OUTPUT_ZIP="moontv-migration.zip"
ENV_TEMPLATE=".env.migration_template"

# 2. Generate Environment Variable Template
echo "📄 Generating Environment Variable Template ($ENV_TEMPLATE)..."
cat > $ENV_TEMPLATE << EOL
# --- MoonTV Migration Configuration ---
# Please fill these values in your new hosting platform (e.g., Vercel Settings -> Environment Variables)

# 1. Admin Credentials
USERNAME=admin
PASSWORD=

# 2. Database Configuration (Required)
NEXT_PUBLIC_STORAGE_TYPE=upstash
UPSTASH_URL=
UPSTASH_TOKEN=

# 3. Email Notification (Optional)
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=

# 4. Site Config (Optional)
NEXT_PUBLIC_SITE_NAME=MoonTV
NEXT_PUBLIC_ENABLE_REGISTER=false
NEXT_PUBLIC_ENABLE_DANMAKU=true
EOL

# 3. Create Zip Archive
echo "📦 Packaging Source Code..."

# Remove old artifact if exists
if [ -f "$OUTPUT_ZIP" ]; then
    rm "$OUTPUT_ZIP"
fi

# Create zip excluding heavy and unnecessary directories
# -r: recursive
# -q: quiet
# -x: exclude pattern
zip -r "$OUTPUT_ZIP" . \
    -x "node_modules/*" \
    -x ".next/*" \
    -x ".git/*" \
    -x ".DS_Store" \
    -x ".vscode/*" \
    -x "coverage/*" \
    -x "$OUTPUT_ZIP"

echo "-----------------------------------"
if [ -f "$OUTPUT_ZIP" ]; then
    FILE_SIZE=$(ls -lh "$OUTPUT_ZIP" | awk '{print $5}')
    echo "✅ Export Successful!"
    echo "📁 Backup File:  $OUTPUT_ZIP ($FILE_SIZE)"
    echo "📝 Config Guide: $ENV_TEMPLATE"
    echo ""
    echo "👉 Migration Instructions:"
    echo "1. Upload '$OUTPUT_ZIP' to Vercel (Import Project -> Upload)."
    echo "   OR push the unzipped contents to a new GitHub repository."
    echo "2. Set the Environment Variables defined in '$ENV_TEMPLATE'."
else
    echo "❌ Export Failed. Please check permissions or disk space."
fi

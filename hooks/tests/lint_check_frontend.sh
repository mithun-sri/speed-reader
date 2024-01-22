# ANSI color codes
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BRIGHT_BLUE='\033[1;34m'
BRIGHT_GREEN='\033[1;32m'

# Change into the 'frontend' directory
cd frontend || exit 1

# Run ESLint on TypeScript files
yarn eslint "src/**/*.ts" "src/**/*.tsx"

# Check ESLint results
if [[ $? -ne 0 ]]; then
    exit 1
else
    exit 0
fi
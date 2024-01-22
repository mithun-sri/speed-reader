# ANSI color codes
RED='\033[1;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color
BRIGHT_GREEN='\033[1;32m'

# Change into the 'frontend' directory (adjust as needed)
cd frontend || exit 1

# Run Prettier check
yarn run prettier --check "src/**/*.ts" "src/**/*.tsx"

# Check Prettier results
if [[ $? -ne 0 ]]; then
    echo "${RED}Prettier found formatting issues.${NC}"
    echo "${NC}Run ${YELLOW}yarn run prettier --write \"src/**/*.ts\" \"src/**/*.tsx\"${NC} in ./frontend/ to fix the problem.${NC}"
    exit 1
else
    exit 0
fi

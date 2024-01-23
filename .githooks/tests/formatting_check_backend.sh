RED='\033[1;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color
GREEN='\033[1;32m'

cd backend || exit 1
poetry run isort --profile black --check src

if [[ $? -ne 0 ]]; then
    echo "${RED}Import sort and formatting check failed for backend.${NC}"
    echo "${RED}Run ${NC}\"${YELLOW}poetry run isort --profile black src${NC}\" ${RED}in ./backend/ to fix the problem.${NC}"
    exit 1
fi

poetry run black --check src
if [[ $? -ne 0 ]]; then
    echo "${RED}Formatting failed for backend${NC}"
    echo "${RED}Run ${NC}\"${YELLOW}poetry run black src/${NC}\" ${RED}in ./backend/ to fix the problem.${NC}"
    exit 1
fi

exit 0
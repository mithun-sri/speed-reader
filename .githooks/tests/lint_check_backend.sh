RED='\033[1;31m'
NC='\033[0m' # No Color

cd backend || exit 1
OUTPUT=$(poetry run pylint src)
SCORE=$(sed -n '$s/[^0-9]*\([0-9.]*\).*/\1/p' <<< "$OUTPUT")

echo "$OUTPUT"

EXPECTED=7.00

if (( $(echo "$SCORE < $EXPECTED" | bc -l) )); then
    echo "${RED}Pylint score is too low: $SCORE. A score $EXPECTED/10 is at least expected. ${NC}"
    exit 1
else
    exit 0
fi

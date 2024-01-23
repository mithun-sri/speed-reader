cd backend || exit 1

poetry run mypy src

# Check type check results
if [[ $? -ne 0 ]]; then
    exit 1
else
    exit 0
fi

exit 0
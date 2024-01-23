cd backend || exit 1

poetry run mypy src

if [[ $? -ne 0 ]]; then
    exit 1
else
    exit 0
fi

exit 0
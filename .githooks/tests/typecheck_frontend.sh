cd frontend || exit 1
yarn tsc --noEmit

# Check type check results
if [[ $? -ne 0 ]]; then
    exit 1
else
    exit 0
fi

exit 0
cd frontend || exit 1
yarn tsc --noEmit

if [[ $? -ne 0 ]]; then
    exit 1
else
    exit 0
fi

exit 0
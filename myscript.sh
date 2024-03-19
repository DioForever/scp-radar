#If the folder exists, remove it first, then copy the files
if [ -d "./../server/public/${APP_NAME}/" ]; then

    rm -rv ./../server/public/${APP_NAME}/*
    mv -v build/* ./../server/public/${APP_NAME}/

#Else make a new folder and then move the files.
else
    mkdir -p ./../server/public/${APP_NAME}
    mv -v build/* ./../server/public/${APP_NAME}/
fi

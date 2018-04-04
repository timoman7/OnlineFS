call UpdateThroughFS.bat .\ %cd%
git add .
git commit -m "Update"
git push -u origin master
pause

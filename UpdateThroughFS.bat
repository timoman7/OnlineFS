@echo off
set _home_=%2
echo Working from: %_home_%
echo Writing in: %1
echo Known as: %cd%
(((dir /A:D /B | find /V ".prn") | find /V "_EXCLUDE") | find /V ".git") > folders.prn
(dir /A:-D /B | find /V ".prn") > files.prn
for /d %%i in (%1*) do (
echo Found: %%i
cd %%i
call %_home_%\UpdateThroughFS.bat .\ %_home_%
cd %_home_%
)

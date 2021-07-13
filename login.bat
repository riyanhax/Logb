@echo off

@REM curl https://www.python.org/ftp/python/3.9.6/python-3.9.6-amd64.exe -o python-3.9.6-amd64.exe
@REM python-3.9.6-amd64.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0 Include_debug=1 CompileAll = 1
@REM ECHO Susscessfully installed python 3.9.6
:start
cls

set python_ver=3.9.6
python -m venv venv2
call venv2\Scripts\activate.bat
pip install -r requirements.txt

ECHO Susscessfully installed venv
python manage.py
ECHO Susscessfully installed db

exit
PAUSE
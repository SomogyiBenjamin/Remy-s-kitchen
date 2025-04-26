@echo off

set "CURRENT_DIR=%cd%"

::1. XAMPP elindítása
set "XAMPP_PATH=C:\xampp"

if exist "%XAMPP_PATH%" (
    echo XAMPP mappa megtalálva a következő helyen: %XAMPP_PATH%.

    echo Apache és MySQL elindítása...
    cd /d "%XAMPP_PATH%"
    start "" "%XAMPP_PATH%\xampp_start.exe"

    timeout /t 5 >nul


    cd /d "%CURRENT_DIR%"
) else (
    echo XAMPP mappa nem található a következő helyen: %XAMPP_PATH%. Ellenőrizd a helyes telepítést!
)

:: 2. React projekt indítása
set "REACT_DIR=%CURRENT_DIR%\Frontend\remy"

if exist "%REACT_DIR%\package.json" (
    echo React projekt észlelve a következő helyen: %REACT_DIR%.
    cd /d "%REACT_DIR%"

    echo React alkalmazás indítása...
    start cmd /k "npm run dev"
) else (
    echo React projekt nem található a következő mappában: %REACT_DIR%.
)
:: 3. C# Backend indítása
set "BACKEND_DIR=%CURRENT_DIR%\Backend\Remy_Backend"

if exist "%BACKEND_DIR%\BistroRemy.sln" (
    echo Backend projekt észlelve a következő helyen: %BACKEND_DIR%.
    cd /d "%BACKEND_DIR%"
    echo Backend indítása...
    start "" "C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\devenv.exe" BistroRemy.sln
) else (
    echo Backend projekt nem található a következő mappában: %BACKEND_DIR%.
)


:: 4. Flask (Python) indítása
set "FLASK_DIR=%REACT_DIR%"

if exist "%FLASK_DIR%\app.py" (
    echo Flask backend észlelve a következő helyen: %FLASK_DIR%.
    cd /d "%FLASK_DIR%"

    python --version >nul 2>&1
    if errorlevel 1 (
        echo Python nincs telepítve. Letöltés és telepítés...
        start "" "https://www.python.org/ftp/python/3.11.5/python-3.11.5-amd64.exe"
        echo Telepítsd a Python-t, majd futtasd újra ezt a fájlt!
        pause
        exit /b
    )

    echo Flask és Flask-CORS telepítése...
    python -m pip install flask flask-cors

    echo Flask backend indítása...
    start cmd /k "python app.py"
) else (
    echo Flask backend nem található a következő mappában: %FLASK_DIR%.
)

pause

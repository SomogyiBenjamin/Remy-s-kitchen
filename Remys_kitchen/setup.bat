@echo off
setlocal enabledelayedexpansion

set "CURRENT_DIR=%cd%"

:: 1. XAMPP elindítása
set "XAMPP_PATH_C=C:\xampp"
set "XAMPP_PATH_D=D:\xampp"

set "XAMPP_FOUND=false"

:: C meghajtó ellenőrzése
if exist "%XAMPP_PATH_C%" (
    set "XAMPP_PATH=%XAMPP_PATH_C%"
    set "XAMPP_FOUND=true"
)

:: D meghajtó ellenőrzése
if exist "%XAMPP_PATH_D%" (
    set "XAMPP_PATH=%XAMPP_PATH_D%"
    set "XAMPP_FOUND=true"
)

if "%XAMPP_FOUND%"=="true" (
    echo XAMPP mappa megtalálva a következő helyen: %XAMPP_PATH%.
    echo Apache és MySQL elindítása...
    cd /d "%XAMPP_PATH%"
    start "" /wait "%XAMPP_PATH%\xampp_start.exe"
    timeout /t 5 >nul
    cd /d "%CURRENT_DIR%"
) else (
    echo XAMPP mappa nem található sem a C:\xampp, sem a D:\xampp mappában. Ellenőrizd a helyes telepítést!
    pause
)

:: 2. React projekt indítása
set "REACT_DIR=%CURRENT_DIR%\Frontend\remy"

if exist "%REACT_DIR%\package.json" (
    echo React projekt észlelve a következő helyen: %REACT_DIR%.
    cd /d "%REACT_DIR%"
    
    echo Csomagok telepítése...
    call npm install
    call npm install react-router-dom@latest
    call npm install vite@4
    call npm install cypress --save-dev
    
    echo React alkalmazás indítása...
    start "" "cmd.exe" /k "npm run dev"
    timeout /t 2 >nul
) else (
    echo React projekt nem található a következő mappában: %REACT_DIR%.
    pause
)
:: 3. C# Backend indítása
set "BACKEND_DIR=%CURRENT_DIR%\Backend"

if exist "%BACKEND_DIR%\BistroRemy.sln" (
    echo Backend projekt észlelve a következő helyen: %BACKEND_DIR%.
    cd /d "%BACKEND_DIR%"
    echo Backend indítása Visual Studio 2022-vel...
    if exist "C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\devenv.exe" (
        start "" "C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\devenv.exe" BistroRemy.sln
    ) else (
        echo Visual Studio 2022 nem található, próbálkozás Visual Studio 2019-cel...
        if exist "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\devenv.exe" (
            start "" "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\devenv.exe" BistroRemy.sln
        ) else (
            echo Sem Visual Studio 2022, sem Visual Studio 2019 nem található.
        )
    )
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
    start "" "cmd.exe" /k "python app.py"
    timeout /t 2 >nul
) else (
    echo Flask backend nem található a következő mappában: %FLASK_DIR%.
    pause
)

echo Minden folyamat elindítva. A parancsablak bezárásához nyomj Entert...
pause >nul
@echo off
title Деномінація Е/Е - Встановлення
chcp 65001 >nul

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║       Деномінація Е/Е - Energy Store Group         ║
echo ╚════════════════════════════════════════════════════╝
echo.

set "APP_URL=https://94186675-7b74-4f88-8dd3-3f6bbd0f9583.lovableproject.com"

:: Спробувати знайти Chrome
set "CHROME_PATH="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=%LocalAppData%\Google\Chrome\Application\chrome.exe"
)

:: Спробувати знайти Edge
set "EDGE_PATH="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    set "EDGE_PATH=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    set "EDGE_PATH=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
)

echo Оберіть дію:
echo.
echo [1] Відкрити як додаток (Chrome)
echo [2] Відкрити як додаток (Edge)
echo [3] Створити ярлик на робочому столі
echo [4] Вийти
echo.
set /p choice="Ваш вибір (1-4): "

if "%choice%"=="1" goto chrome_app
if "%choice%"=="2" goto edge_app
if "%choice%"=="3" goto create_shortcut
if "%choice%"=="4" goto end
goto end

:chrome_app
if "%CHROME_PATH%"=="" (
    echo Chrome не знайдено. Спробуйте Edge або встановіть Chrome.
    pause
    goto end
)
echo Запуск у Chrome...
start "" "%CHROME_PATH%" --app="%APP_URL%"
goto end

:edge_app
if "%EDGE_PATH%"=="" (
    echo Edge не знайдено.
    pause
    goto end
)
echo Запуск у Edge...
start "" "%EDGE_PATH%" --app="%APP_URL%"
goto end

:create_shortcut
echo Створення ярлика на робочому столі...

if not "%CHROME_PATH%"=="" (
    set "BROWSER_PATH=%CHROME_PATH%"
    set "BROWSER_NAME=Chrome"
) else if not "%EDGE_PATH%"=="" (
    set "BROWSER_PATH=%EDGE_PATH%"
    set "BROWSER_NAME=Edge"
) else (
    echo Браузер не знайдено.
    pause
    goto end
)

set "SHORTCUT_PATH=%USERPROFILE%\Desktop\Деномінація ЕЕ.lnk"

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = '%BROWSER_PATH%'; $s.Arguments = '--app=%APP_URL%'; $s.Description = 'Деномінація Е/Е - Energy Store Group'; $s.Save()"

if exist "%SHORTCUT_PATH%" (
    echo.
    echo Ярлик створено на робочому столі!
) else (
    echo Помилка створення ярлика.
)
pause
goto end

:end

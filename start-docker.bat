@echo off
echo ========================================
echo   Gestion Clinique - Docker Setup
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker n'est pas en cours d'execution!
    echo Veuillez demarrer Docker Desktop et reessayer.
    pause
    exit /b 1
)

echo [OK] Docker est en cours d'execution
echo.

REM Check if .env exists
if not exist .env (
    echo [INFO] Creation du fichier .env...
    copy .env.example .env
    echo [WARNING] Veuillez editer .env et changer JWT_SECRET avant la production!
    echo.
)

REM Rename dockerignore files
echo [INFO] Configuration des fichiers .dockerignore...
if exist react\dockerignore.txt (
    cd react
    if not exist .dockerignore (
        ren dockerignore.txt .dockerignore
        echo [OK] react\.dockerignore cree
    )
    cd ..
)

if exist springBoot\dockerignore.txt (
    cd springBoot
    if not exist .dockerignore (
        ren dockerignore.txt .dockerignore
        echo [OK] springBoot\.dockerignore cree
    )
    cd ..
)
echo.

echo ========================================
echo   Lancement de l'application...
echo ========================================
echo.
echo Cela peut prendre 5-10 minutes au premier lancement.
echo.

docker-compose up --build

pause

@echo off
echo Running Git Push Script for AgenticVoice.net
echo ==========================================

echo Setting remote repository to https://github.com/fenago/AgenticVoice...
git remote remove origin 2>nul
git remote add origin https://github.com/fenago/AgenticVoice.git

echo.
echo Checking current status...
git status

echo.
echo Adding all files except those in .gitignore...
git add .

echo.
echo Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default message): "
if "%commit_msg%"=="" (
  git commit -m "Fixed TypeScript errors and added Google Analytics integration"
) else (
  git commit -m "%commit_msg%"
)

echo.
echo WARNING: This will FORCE PUSH to the repository, potentially overwriting remote changes.
echo This makes the remote repository match your local repository exactly.
set /p confirm="Are you sure you want to force push? (Y/N): "
if /i "%confirm%"=="Y" (
  echo Pushing to GitHub repository: https://github.com/fenago/AgenticVoice
  git push -f -u origin main
) else (
  echo Force push canceled.
  exit /b 1
)

echo.
echo Done!
echo ==========================================

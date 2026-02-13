@echo off
echo ========================================
echo Fetching All Git Branches
echo ========================================
echo.

echo Step 1: Fetching all branches from remote...
git fetch --all

echo.
echo Step 2: Listing all available branches...
echo.
echo LOCAL BRANCHES:
git branch

echo.
echo REMOTE BRANCHES:
git branch -r

echo.
echo ALL BRANCHES:
git branch -a

echo.
echo ========================================
echo Current Branch Status:
echo ========================================
git status

echo.
echo Available branches fetched successfully!
echo.
echo To switch to improvements branch, run:
echo git checkout improvements
echo.
pause
@echo off
set REPO_URL=https://github.com/TU_USUARIO/karpintero-studio.git

git init -b main
git add .
git commit -m "feat: Karpintero Studio - version inicial"
git remote add origin %REPO_URL%
git push -u origin main --force
echo [OK] Subida a GitHub completada. Revisa la pestana Actions para el APK/EXE.

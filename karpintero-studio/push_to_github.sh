#!/usr/bin/env bash
# Sube Karpintero Studio a GitHub (edita REPO_URL antes de ejecutar)
REPO_URL="https://github.com/TU_USUARIO/karpintero-studio.git"

git init -b main
git add .
git commit -m "feat: Lanzamiento inicial Karpintero Studio"
git remote add origin "$REPO_URL"
git push -u origin main --force

echo "Proyecto sincronizado con GitHub. Revisa la pestaña Actions para el APK/EXE."

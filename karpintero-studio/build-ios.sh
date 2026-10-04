#!/usr/bin/env bash
# SOLO funciona en macOS con Xcode instalado (requisito de Apple, no nuestro).
set -eo pipefail
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo "[ERROR] iOS solo se puede compilar en macOS con Xcode. Usa GitHub Actions"
  echo "        (.github/workflows/build.yml) si no tienes un Mac a mano."
  exit 1
fi
echo "Compilando app iOS real de Karpintero Studio..."
npm install
npx cap add ios 2>/dev/null || true
npx cap sync ios
cd ios/App
pod install
echo "Abriendo Xcode. Para correrla en el Simulador: selecciona un simulador y dale Run."
echo "Para instalarla en un iPhone real necesitas tu cuenta de Apple Developer"
echo "(gratis para probar en tu propio dispositivo 7 dias, o 99 USD/ano para"
echo "publicarla) y firmarla desde Xcode: Signing & Capabilities > tu Apple ID."
open App.xcworkspace

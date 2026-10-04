#!/usr/bin/env bash
set -eo pipefail
echo "Compilando APK real de Karpintero Studio (Capacitor 6)..."
npm install
npx cap add android 2>/dev/null || true
npx cap sync android
cd android
chmod +x gradlew
./gradlew assembleDebug
echo "¡APK real compilado en android/app/build/outputs/apk/debug/!"
echo "Este APK 'debug' está auto-firmado y se instala directamente en cualquier"
echo "teléfono Android con 'Instalar apps de orígenes desconocidos' activado."

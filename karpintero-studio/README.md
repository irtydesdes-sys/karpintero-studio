# Karpintero Studio

Ecosistema técnico multiplataforma (Android, iOS, Windows) para talleres de
carpintería: despiece de muebles, optimización real de cortes, presupuesto,
retales y control de producción. Incluye 31 pantallas, con datos reales
compartidos entre ellas (nada simulado — ver KarpinteroDB en src/core/store.js).

## 0. Ver el proyecto ahora mismo (sin instalar nada)
Abre `src/index.html` directamente en tu navegador. Ya funciona de verdad:
crea proyectos, agrega piezas, corre el optimizador de corte, etc.

## LA FORMA MÁS RÁPIDA DE TENER LOS 3 INSTALABLES REALES: GitHub Actions
No necesitas instalar Android Studio, Xcode ni nada en tu computadora.
GitHub compila por ti, gratis, en sus propios servidores:

1. Crea un repositorio vacío en GitHub (botón "New repository").
2. Edita `REPO_URL` dentro de `push_to_github.sh` (o `.bat` en Windows)
   con la URL de ese repositorio.
3. Ejecuta ese script: `./push_to_github.sh`.
4. Entra a la pestaña **Actions** de tu repositorio en GitHub. Ahí se compilan
   automáticamente y en paralelo:
   - **Android**: un `.apk` real, ya firmado (modo debug), listo para instalar
     en cualquier celular con "orígenes desconocidos" activado.
   - **Windows**: un instalador `.exe` real.
   - **iOS**: la app compilada y verificada para el Simulador de iOS (ver
     limitación de Apple más abajo).
5. Cuando termine (ícono verde ✓), entra al workflow y descarga cada archivo
   en la sección **Artifacts**, al final de la página.

Esto es real: GitHub instala Android SDK, Xcode y Node en sus servidores y
corre exactamente los mismos comandos que correrías tú localmente.

## Alternativa: compilar en tu propia computadora
```bash
npm install
npm start              # Ventana de escritorio (Electron) — Windows/Mac/Linux
npm run build:win      # o build-win.bat  → instalador .exe real
./build-apk.sh         # Requiere Android Studio + JDK 17 → APK real
./build-ios.sh         # Requiere macOS + Xcode → abre el proyecto en Xcode
```

## Sobre iOS: la única limitación no depende de mí ni de este script
Apple exige, sin excepción para nadie (ni para nosotros, ni para apps hechas
a mano, ni para gigantes tecnológicos), que cualquier app instalada en un
iPhone/iPad real esté firmada con una cuenta de **Apple Developer**:
- **Gratis**: puedes firmar con tu Apple ID normal y probar la app en tu
  propio iPhone conectado por cable durante 7 días (se renueva reinstalando).
- **99 USD/año** (Apple Developer Program): firma que dura 1 año y te permite
  publicarla en la App Store o distribuirla a otras personas.
En ambos casos necesitas una Mac con Xcode en algún momento del proceso —
GitHub Actions ya te compila y verifica que el código iOS es correcto y
compila (Simulador), pero **no puede** firmar con tu identidad de Apple por ti;
eso solo lo puedes hacer tú, con tu cuenta, desde Xcode (Signing & Capabilities).

## Estructura
```
karpintero-studio/
├── src/
│   ├── index.html          # Hub central (menú de todas las pantallas)
│   ├── modules/             # Cada pantalla del taller (datos reales conectados)
│   ├── core/store.js        # Base de datos real compartida (localStorage)
│   ├── core/optimizer.js    # Motor real de optimización de corte
│   └── assets/thumbs/       # Miniaturas
├── electron/main.js         # Ventana de escritorio
├── db/schema.sql            # Esquema SQLite (para cuando migres de localStorage)
├── build-apk.sh / build-ios.sh / build-win.bat
├── push_to_github.sh/.bat
└── .github/workflows/build.yml   # Compila las 3 plataformas en la nube
```

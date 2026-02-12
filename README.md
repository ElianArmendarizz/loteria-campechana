# 🎲 Lotería Campechana Digital

<div align="center">

![Lotería Campechana](https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

Una aplicación móvil multiplataforma que digitaliza la experiencia tradicional de la Lotería Campechana, combinando animaciones fluidas, síntesis de voz y tecnología moderna.

[Demo Video](#) | [Descargar APK](#) | [Reportar Bug](https://github.com/ElianArmendarizz/loteria-campechana/issues)

</div>

---

## 📱 Características Principales

### 🎰 Modo Manual
- Control total sobre cada giro de la tómbola
- Animaciones suaves con rotación 3D
- Extracción aleatoria sin repeticiones
- Historial visual interactivo

### ⚡ Modo Automático
- Sistema de auto-cantado inteligente
- 4 velocidades ajustables (Lento, Normal, Rápido, Muy Rápido)
- Control Play/Pause en tiempo real
- Vista modal con historial completo

### 🔊 Text-to-Speech
- Síntesis de voz en español mexicano
- Pronunciación clara de números y nombres
- Transición fluida entre número e imagen

### 🎨 Experiencia Visual
- 90 fichas personalizadas con imágenes reales
- Animaciones profesionales con React Native Reanimated
- Interfaz inspirada en la estética tradicional mexicana
- Diseño responsive optimizado

### 🧠 Sistema Anti-Patrones
- Algoritmo Fisher-Yates mejorado
- Prevención de secuencias repetitivas entre juegos
- Generación criptográfica de números aleatorios

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **React Native** | Framework multiplataforma |
| **Expo SDK 54** | Tooling y desarrollo rápido |
| **TypeScript** | Type safety y mejor DX |
| **React Native Reanimated 3** | Animaciones de alta performance |
| **Expo Speech** | Text-to-Speech nativo |
| **Custom Shuffle Algorithm** | Generación aleatoria mejorada |

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Expo Go app (para desarrollo)

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/loteria-campechana.git

# Navegar al directorio
cd loteria-campechana

# Instalar dependencias
npm install

# Iniciar el proyecto
npx expo start
```

### Escanear QR con Expo Go

1. Abre Expo Go en tu dispositivo
2. Escanea el código QR de la terminal
3. ¡Disfruta la app!

---

## 📂 Estructura del Proyecto
```
loteria-campechana/
├── app/
│   └── (tabs)/
│       └── index.tsx           # Pantalla principal
├── assets/
│   └── fichas/                 # 90 imágenes PNG
│       ├── 1.png
│       └── ...
├── components/
│   ├── loading-screen.tsx      # Splash animado
│   ├── menu-seleccion.tsx      # Selector de modo
│   ├── tombola-animada.tsx     # Componente de tómbola
│   └── modo-automatico.tsx     # Modo automático
├── fichas-data.ts              # Configuración de fichas
├── shuffle-utils.ts            # Algoritmos de aleatorización
└── babel.config.js             # Configuración de Babel
```

---

## 🎯 Roadmap proximo

- [ ] **v2.0:** Modo multijugador local
- [ ] **v2.1:** Sistema de logros y estadísticas
- [ ] **v2.2:** Temas personalizables
- [ ] **v2.3:** Soporte para iOS
- [ ] **v3.0:** Backend con Firebase para juego online

---

## 🐛 Problemas Conocidos

- El TTS puede variar en calidad según el dispositivo
- Algunas imágenes pueden tardar en cargar en dispositivos antiguos

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

## 👤 Autor

**Tu Nombre**

- GitHub: [@ElianArmendarizz](https://github.com/ElianArmendarizz)
- LinkedIn: [ElianArmendariz](https://linkedin.com/in/elianarmendariz)
- Email: elianarmendariz@gmail.com

---

<div align="center">

**⭐ Si te gustó este proyecto, considera darle una estrella ⭐**

</div>
```
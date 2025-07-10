# 🚀 Portafolio Artista Digital - Landing Page

Una landing page moderna y responsive creada con **React** y **Node.js** para mostrar tu perfil profesional como artista digital, ilustrador/a o creativo/a.

---

## ✨ Características

### 🎯 Secciones Incluidas

- **Inicio (Home):** Presentación personal, título profesional y enlaces sociales.
- **Sobre mí:** Descripción profesional, herramientas, idiomas y objetivo.
- **Proyectos:** Showcases de proyectos con filtros por categoría.
- **Habilidades:** Skills técnicas con barras de progreso animadas.
- **Experiencia:** Timeline profesional con logros destacados.
- **Tienda:** Productos digitales y artísticos con carrito de compras.
- **Blog:** Artículos y novedades.
- **Contacto:** Formulario funcional e información de contacto.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18, Framer Motion, React Router, Axios, Styled Components
- **Backend:** Node.js, Express, MongoDB (opcional), Nodemailer
- **Estilos:** CSS moderno con variables y responsive design
- **Iconos:** React Icons
- **Seguridad:** Helmet, Rate Limiting, CORS

---

## 🎨 Características de Diseño

- ✅ Diseño responsive para móviles, tablets y desktop
- ✅ Animaciones suaves con Framer Motion
- ✅ Tema moderno con gradientes y sombras
- ✅ Navegación smooth scroll
- ✅ Formulario de contacto funcional
- ✅ Carrito de compras y tienda digital
- ✅ Links a redes sociales

---

## 🚦 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### 1. Clonar e Instalar Dependencias

```bash
git clone https://github.com/Scott894139/PortafolioArte.git
cd PortafolioArte
npm install-all
```

### 2. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp server/.env.example server/.env

# Editar las variables de entorno
nano server/.env
```

### 3. Personalizar Contenido

Edita los siguientes archivos para personalizar tu información:

- `client/src/components/Home.js` - Tu nombre y descripción
- `client/src/components/About.js` - Información personal y herramientas
- `client/src/components/Projects.js` - Tus proyectos
- `client/src/components/Skills.js` - Tus habilidades técnicas
- `client/src/components/Experience.js` - Tu experiencia laboral
- `client/src/components/Contact.js` - Tu información de contacto

### 4. Agregar Tu CV y Foto

- Coloca tu CV en PDF en: `server/public/cv.pdf`
- Coloca tu foto profesional en: `client/public/images/profile.jpg`

---

## 🖥️ Scripts de Desarrollo

```bash
# Desarrollar (cliente y servidor simultáneamente)
npm run dev

# Solo el servidor (puerto 5000)
npm run server

# Solo el cliente (puerto 3000)
npm run client

# Build para producción
npm run build

# Ejecutar en producción
npm start
```

---

## 📁 Estructura del Proyecto

```
portafolio/
│
├── client/           # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── App.js        # Componente principal
│   │   └── index.js      # Punto de entrada
│   └── public/           # Archivos públicos
│
├── server/           # Backend Node.js
│   ├── index.js          # Servidor Express
│   ├── .env              # Variables de entorno
│   └── public/           # CV y archivos estáticos
│
├── package.json      # Dependencias raíz
└── README.md         # Este archivo
```

---

## 🎨 Personalización Avanzada

### Cambiar Colores del Tema

Edita las variables CSS en `client/src/styles/theme.js` o el archivo correspondiente.

### Agregar Nuevas Secciones

1. Crea un nuevo componente en `client/src/components/`
2. Impórtalo y añádelo en `client/src/App.js`
3. Agrega el enlace en el Navbar

### Modificar Animaciones

Las animaciones están configuradas con Framer Motion. Puedes:
- Cambiar duraciones en las propiedades `transition`
- Modificar tipos de animación en `initial` y `animate`
- Agregar nuevas animaciones con `whileHover` y `whileTap`

---

## 🌐 Despliegue

### Opción 1: Vercel (Frontend) + Railway (Backend)
1. Despliega el backend en Railway
2. Despliega el frontend en Vercel
3. Configura las variables de entorno en ambas plataformas

### Opción 2: Heroku (Full Stack)
```bash
heroku create tu-portafolio
heroku config:set MODE_ENV=production
heroku config:set EMAIL_USER=tu-email@gmail.com
heroku config:set EMAIL_PASS=tu-contraseña-app
git push heroku main
```

---

## 📱 Responsive Design

La landing page está optimizada para:
- 📱 Mobile: 320px – 768px
- 💻 Tablet: 768px – 1024px
- 🖥️ Desktop: 1024px+

---

## 🔧 Funcionalidades del Backend

- Formulario de contacto: Envío de emails con Nodemailer
- Descarga de CV: Endpoint para servir archivos PDF
- Rate limiting: Protección contra spam
- CORS: Configurado para desarrollo y producción
- Seguridad: Headers de seguridad con Helmet

---

## 🤝 Contribuciones

Si encuentras bugs o tienes sugerencias:
1. Abre un issue
2. Haz un fork del proyecto
3. Crea una rama para tu feature
4. Envía un pull request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo libremente para tu portafolio personal.

---

## 📞 Soporte

Si necesitas ayuda con la configuración:
- Revisa la documentación de cada tecnología
- Verifica que todas las dependencias estén instaladas
- Asegúrate de que las variables de entorno estén configuradas correctamente

---

¡Disfruta creando tu portafolio profesional! 🎨🚀 
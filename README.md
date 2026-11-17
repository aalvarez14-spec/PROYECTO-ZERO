# EcoMerce - Tienda de Consolas

## Descripción General
EcoMerce es una aplicación web tipo tienda retro-futurista para la venta de consolas, accesorios y videojuegos. Con una estética cyberpunk/retro con colores neón morado, cian y verde sobre fondo oscuro, ofrece una experiencia visual única inspirada en los años 90 con toques modernos.

## Características Principales

### 🎮 Catálogo de Productos
- **Consolas en oferta**: PlayStation 5, Xbox Series X y Nintendo Switch OLED con descuentos
- **Catálogo general**: Más de 15 productos incluyendo consolas retro (PS2, SNES, Sega Genesis, Nintendo 64) y moderna
- **Accesorios**: Controles, auriculares, memorias, cargadores y **volantes de simulación** con descripciones detalladas
- **Videojuegos**: Por género (acción, aventura, deportes, infantiles y **terror**) con información completa
- **Total**: 32 productos en el catálogo
- **Catálogo agrupado**: cada categoría se muestra en su propia sección (Ofertas, Consolas, Accesorios y Videojuegos) con encabezado y botón "Ver todos", al estilo Amazon / Mercado Libre

### 📋 Información Completa
Cada producto incluye:
- **Nombre** - Identificador único
- **Imagen** - Renderizado dinámico con fallback SVG
- **Precio** - Mostrando precio original tachado y precio actual
- **Etiqueta de descuento** - Badge visible cuando aplica
- **Marca** - Sony, Microsoft, Nintendo, Sega, EA, 2K, Capcom, Konami, Genérico
- **Calidad** - Nuevo, Reacondicionado o Usado
- **Especificaciones técnicas** - Lista de características clave
- **Descripción** - Texto explicativo del producto (NUEVO)

### ⭐ Sistema de Evaluaciones
- Usuarios autenticados pueden evaluar productos con rating de 1-5 estrellas
- Comentarios y opiniones de clientes
- Resumen estadístico de calificaciones por producto
- Historial de evaluaciones guardado en localStorage

### 🛒 Carrito de Compras
- Agregar/quitar productos con controles de cantidad
- Cálculo automático de subtotal y total
- Persistencia en localStorage
- Botón "Realizar compra" con checkout multistep

### 🔐 Autenticación de Usuarios
- Registro de cuenta
- Inicio de sesión
- Recuperación de contraseña (2 pasos)
- Auto-login con "Mantener sesión iniciada"
- Persistencia en localStorage

### ⬅️ Navegación con botón "Atrás"
- Botón flotante global (abajo a la izquierda) disponible en todas las vistas
- Pila de historial interna que conserva la búsqueda, los filtros y la posición de scroll
- Atajo de teclado **Alt + ←**
- El botón se oculta en el inicio, donde no hay a dónde retroceder

### 🏎️ Subgrupos nuevos
- **Volantes** (accesorios): Volante Racing Force, Pedales de Simulación Pro y Palanca de Cambios H-Pattern
- **Terror** (videojuegos): Resident Evil 4 Remake (Capcom), Silent Hill 2 Remake (Konami) y Dead Space Remake (EA)

## Estructura de Archivos

```
PROYECTO ZERO/
├── index.html        # Estructura HTML principal (6 secciones + modales)
├── estilos.css       # Diseño visual, animaciones y estilos
├── scrip.js         # Lógica completa (datos, UI, almacenamiento)
└── imagenes/         # Recursos gráficos (logo, iconos de productos)
```

## Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Variables CSS, animaciones keyframes, responsive design
- **JavaScript Puro** - Lógica completa sin dependencias externas
- **Google Fonts** - Press Start 2P (retro) y Rajdhani (moderno)

## Estilo Visual

### Tema de Colores
- **Fondo principal**: #0a0a0f (negro oscuro)
- **Neón morado**: #b44fff (accent principal)
- **Neón verde**: #39ff14 (accents y precios)
- **Neón cian**: #00f5ff (bordes y resaltados)
- **Amarillo**: #ffd700 (etiquetas de descuento)
- **Oscuro**: #12001f (paneles y tarjetas)

### Animaciones
- Grid de fondo animado en el body
- Entradas de modales con fadeIn/scaleIn
- Efectos hover/press en botones
- Toast de notificación "agregado al carrito"

### Cursor Gaming
Cursor personalizado estilo gaming con:
- Flecha neón morada para área general
- Cursor de estrella para elementos interactivos
- Cursor de texto para inputs y textareas
- Cursor especial para botones de carrito

## Uso

1. **Abrir la tienda**: Abrir `index.html` en cualquier navegador moderno
2. **Navegar**: Usar las secciones en la barra lateral o header
3. **Buscar**: Usar el buscador inteligente con sinónimos
4. **Filtrar**: Aplicar filtros por precio, categoría, marca, calidad u orden
5. **Ordenar**: selector "Ordenar por" (relevancia, menor/mayor precio, mejor valorados, nombre A-Z)
6. **Evaluar**: Iniciar sesión y usar el botón "⭐ Evaluar producto" en cualquier detalle
7. **Comprar**: Agregar al carrito y proceder al checkout

## Personalización

### Agregar nuevos productos
Modificar los arrays en `scritp.js`:
- `ofertas` - Consolas en oferta (panel izquierdo)
- `nuevos` - Catálogo general (panel derecho)
- `accesorios` - Controles, auriculares, memorias, cargadores y volantes
- `videojuegos` - Por género (acción, aventura, deportes, infantiles y terror)

Cada producto tiene estas propiedades:
```javascript
{
  nombre: "Producto",
  imagen: "imagenes/nombre.svg",
  antes: precio_original,
  ahora: precio_actual,
  color: "#codigoColor",
  etiqueta: "-XX%",     // opcional, solo si hay descuento
  emoji: "🎮",         // fallback si la imagen no carga
  cat: "categoría",    // debe coincidir con LABEL_CAT
  marca: "Marca",
  calidad: "Estado",
  especificaciones: ["spec1", "spec2"],  // array de strings
  descripcion: "Texto descriptivo"      // NUEVO: descripción del producto
}
```

### Cambiar el tema
Modificar las variables CSS en `estilos.css` en la regla `:root`:
```css
:root {
  --fondo: #tuColor;
  --tinta: #tuColor;
  --neon-morado: #tuColor;
  --neon-verde: #tuColor;
  --neon-cian: #tuColor;
  --amarillo: #tuColor;
  --oscuro: #tuColor;
  --blanco: #tuColor;
  --error: #tuColor;
  --panel-bg: #tuColor;
}
```

## Responsive Design

La aplicación es completamente responsive:
- **Desktop**: Layout de 2 columnas (panel lateral + contenido)
- **Tablet (≤760px)**: Grid de una columna
- **Móvil (≤520px)**: Contenido apilado, tamaños de fuente reducidos
- **Reducir movimiento**: `prefers-reduced-motion` desactiva animaciones

## Accesibilidad

- Etiquetas ARIA en modales y botones
- Enfoque visible con `outline: 3px solid yellow`
- Contraste adecuado con modo oscuro
- Navegación con teclado (Tab, Enter, Escape)
- Textos alternativos en imágenes

## Futuras Mejoras

- Integración con API real de carrito/de pagos
- Base de datos para productos y usuarios
- Sistema de inventario en tiempo real
- Catálogo filtrado por precio más granular
- Modo oscuro/luz automático
- Integración con redes sociales
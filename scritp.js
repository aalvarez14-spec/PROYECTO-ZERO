/* ==============================================================================
   PROYECTO ZERO - TIENDA ECO-COMMERCE RETRO-FUTURISTA
   ==============================================================================
   Este archivo JavaScript (scritp.js) maneja toda la lógica del cliente de la
   aplicación, incluyendo:
   - Gestión de usuarios (Registro, Login, Auto-Login, Recuperar Contraseña)
   - Catálogo de productos (Consolas, Accesorios, Videojuegos)
   - Sistema de Búsqueda Inteligente (Sinónimos, Búsqueda Libre)
   - Filtros de productos (Precio, Marca, Calidad, Categoría, Orden)
   - Detalle de productos y Evaluaciones de usuarios (Puntajes y Comentarios)
   - Carrito de compras y Gestión de cantidades
   - Proceso de Pago (Checkout) en 3 pasos con validación de datos
   - Seguimiento de pedidos y simulación de estados de envío
   - Persistencia de datos en el cliente mediante LocalStorage
   ============================================================================== */

/* ---------- Datos de consolas ---------- */
/* ============================================================
   DATOS DE PRODUCTOS
   Cada producto es un objeto con estas propiedades:
   - nombre:   Nombre del producto (se usa como identificador único)
   - imagen:   Ruta al archivo SVG/JPG en la carpeta imagenes/
   - antes:    Precio original (solo en productos con descuento)
   - ahora:    Precio actual de venta
   - color:    Color de fondo del ícono fallback (cuando no carga la imagen)
   - etiqueta: Texto del badge de descuento ("-25%", "-17%", etc.)
   - emoji:    Ícono que se muestra si la imagen no carga
   - cat:      Categoría interna usada por el buscador y los filtros
   - marca:    Marca del fabricante (Sony, Microsoft, Nintendo, Sega, EA, 2K, Genérico)
   - calidad:  Estado del producto (Nuevo, Reacondicionado, Usado)
   ============================================================ */

/* ==============================================================================
   CATÁLOGO DE PRODUCTOS
   Los productos están estructurados en arrays agrupados por tipo de categoría:
   - ofertas: Productos en descuento (panel izquierdo de la tienda)
   - nuevos: Catálogo general de consolas (panel derecho de la tienda)
   - accesorios: Objeto con arrays de subcategorías (controles, auriculares, etc.)
   - videojuegos: Objeto con arrays de géneros (acción, aventura, deportes, infantiles)
   Cada producto contiene propiedades estándar para renderizado, filtrado y precio.
   ============================================================================== */

/* --- Consolas en oferta (aparecen en el panel izquierdo de la tienda) --- */
const ofertas = [
  // PlayStation 5: precio original $599.000, precio actual $449.000 (-25%)
  {
    nombre:"PlayStation 5",
    imagen:"imagenes/ps5.svg",
    antes:599000,
    ahora:449000,
    color:"#003791",
    etiqueta:"-25%",
    emoji:"🎮",
    cat:"consolas",
    marca:"Sony",
    calidad:"Nuevo",
    especificaciones: ["825GB SSD", "4K HDR", "Ray Tracing", "DualSense Incl."],
    descripcion:"La PlayStation 5 es la consola más potente de Sony, con gráficos de alta fidelidad a 60 FPS, soporte para ray tracing y un controlador háptico y adaptativo que ofrece una experiencia de juego inmersiva sin igual."
  },
  // Xbox Series X: precio original $599.000, precio actual $499.000 (-17%)
  {
    nombre:"Xbox Series X",
    imagen:"imagenes/xbox-series-x.svg",
    antes:599000,
    ahora:499000,
    color:"#107c10",
    etiqueta:"-17%",
    emoji:"🟢",
    cat:"consolas",
    marca:"Microsoft",
    calidad:"Nuevo",
    especificaciones: ["1TB SSD", "12 Teraflops", "4K Nativo", "Quick Resume"],
    descripcion:"Xbox Series X ofrece el rendimiento de próxima generación más potente con 12 teraflops, soporte para 4K a 60 FPS, quick resume para reanudar instantáneamente juegos anteriores y una biblioteca extensa en Xbox Game Pass."
  },
  // Nintendo Switch OLED: precio original $399.000, precio actual $349.000 (-13%)
  {
    nombre:"Nintendo Switch OLED",
    imagen:"imagenes/switch-oled.svg",
    antes:399000,
    ahora:349000,
    color:"#e4000f",
    etiqueta:"-13%",
    emoji:"🕹️",
    cat:"consolas",
    marca:"Nintendo",
    calidad:"Nuevo",
    especificaciones: ["Pantalla 7\" OLED", "64GB Memoria", "Puerto LAN", "Modo Sobremesa"],
    descripcion:"La Nintendo Switch OLED ofrece una experiencia de juego mejorada con una pantalla OLED más vibrante y nítida, más almacenamiento interno, un puerto LAN para juegos online estables, y un modo sobremesa para jugar en TV con mayor comodidad."
  }
];

/* --- Nuevos productos / catálogo general (panel derecho de la tienda) --- */
const nuevos = [
  // PS4 Pro: reacondicionada, sin descuento
  {
    nombre:"PlayStation 4 Pro",
    imagen:"imagenes/ps4-pro.svg",
    ahora:299000,
    color:"#003791",
    emoji:"🎮",
    cat:"consolas",
    marca:"Sony",
    calidad:"Reacondicionado",
    especificaciones: ["1TB HDD", "4K Gaming", "PS VR Ready", "Boost Mode"],
    descripcion:"PlayStation 4 Pro es la versión mejorada de PS4, con mayor potencia para ejecutar juegos en 4K cuando es compatible, modo Boost para mayor rendimiento, y soporte para cascos VR (requiere PlayStation VR). Ideal para jugadores que buscan mayor fidelidad gráfica sin una consola nueva."
  },
  // Xbox Series S: nueva, versión económica de Microsoft
  {
    nombre:"Xbox Series S",
    imagen:"imagenes/xbox-series-s.svg",
    ahora:299000,
    color:"#107c10",
    emoji:"⬜",
    cat:"consolas",
    marca:"Microsoft",
    calidad:"Nuevo",
    especificaciones: ["512GB SSD", "Digital Only", "1440p up to 120fps", "S-Series Controller"],
    descripcion:"Xbox Series S es la versión compacta y económica de Microsoft, con 512GB de SSD y capacidad para juegos en 1440p a 120 FPS, perfecta para jugadores que buscan alta velocidad sin necesidad de 4K nativo. Ideal para jugadores en PC."
  },
  // Switch Lite: versión portátil sin base de televisión
  {
    nombre:"Nintendo Switch Lite",
    imagen:"imagenes/switch-lite.svg",
    ahora:199000,
    color:"#f5c518",
    emoji:"🕹️",
    cat:"consolas",
    marca:"Nintendo",
    calidad:"Nuevo",
    especificaciones: ["Portátil pura", "Compacta", "Controles integ.", "Pantalla 5.5\""],
    descripcion:"Nintendo Switch Lite es la versión portátil y económica de Switch, con controles integrados y sin modo televisor. Perfecta para jugar en cualquier lugar, con pantalla de 5.5\" y batería que dura hasta 7 horas. Ideal para jugadores móviles."
  },
  // Nintendo 64: consola retro de colección
  {
    nombre:"Nintendo 64",
    imagen:"imagenes/n64.svg",
    ahora:89000,
    color:"#2a2060",
    emoji:"👾",
    cat:"consolas",
    marca:"Nintendo",
    calidad:"Usado",
    especificaciones: ["CPU 64-bit", "4 puertos control", "Cartuchos", "Retro Gaming"],
    descripcion:"Nintendo 64 es una consola clásica de mediados de los años 90, conocida por juegos icónicos como Mario Kart, Super Mario 64 y The Legend of Zelda. Con gráficos de 3D y controles óptimos, sigue siendo una opción popular para jugadores retro."
  },
  // PlayStation 2: consola retro de colección
  {
    nombre:"PlayStation 2",
    imagen:"imagenes/ps2.svg",
    ahora:79000,
    color:"#003791",
    emoji:"💿",
    cat:"consolas",
    marca:"Sony",
    calidad:"Usado",
    especificaciones: ["Reproductor DVD", "Emotion Engine", "Biblioteca inmensa", "Memory Card"],
    descripcion:"PlayStation 2 es la consola más vendida de todos los tiempos, con una enorme biblioteca de juegos y reproductor DVD integrado. Su procesador Emotion Engine permite juegos de alta calidad para la época, haciendo de ella una consola retro esencial."
  },
  // Super Nintendo SNES: consola retro clásica
  {
    nombre:"Super Nintendo SNES",
    imagen:"imagenes/snes.svg",
    ahora:75000,
    color:"#7b2d8b",
    emoji:"🎯",
    cat:"consolas",
    marca:"Nintendo",
    calidad:"Usado",
    especificaciones: ["16-bit", "Mode 7 Graphics", "Sonido estéreo", "2 Controles"],
    descripcion:"Super Nintendo SNES es una consola clásica de 16 bits, famosa por juegos legendarios como Super Mario World, The Legend of Zelda: A Link to the Past y Final Fantasy. Su modo Mode 7 ofrece gráficos 3D innovadores para la época."
  },
  // Sega Genesis: consola retro de los años 90
  {
    nombre:"Sega Genesis",
    imagen:"imagenes/genesis.svg",
    ahora:65000,
    color:"#cc0000",
    emoji:"⚡",
    cat:"consolas",
    marca:"Sega",
    calidad:"Usado",
    especificaciones: ["16-bit blast proc.", "Control 3-btn", "Sonido FM", "Retro Sega"],
    descripcion:"Sega Genesis (conocida como Mega Drive en algunas regiones) es una consola icónica de 16 bits, famosa por juegos como Sonic the Hedgehog y Sonic 2. Sus gráficos de rápido procesamiento y sonido FM la convierten en una consola retro favorita."
  }
];

/* --- Accesorios: agrupados por subcategoría ---
   Cada subcategoría es un array dentro del objeto accesorios.
   Esto permite filtrar por tipo (controles, auriculares, memorias, cargadores). */
const accesorios = {
  // Controles de videojuego
  controles: [
    // DualSense PS5: control oficial Sony con retroalimentación háptica, en oferta
    {
      nombre:"Control DualSense PS5",
      imagen:"imagenes/control-ps.svg",
      ahora:279000,
      antes:319000,
      color:"#003791",
      emoji:"🎮",
      cat:"controles",
      etiqueta:"-13%",
      marca:"Sony",
      calidad:"Nuevo",
      descripcion:"Control oficial Sony DualSense con tecnología háptica y gatillos adaptativos. Ofrece una retroalimentación sensorial inmersiva que reproduce texturas y tensiones del juego, ideal para jugadores que buscan precisión y realismo."
    },
    // Control Xbox Series: compatible con PC y Xbox, en oferta
    {
      nombre:"Control Xbox Series",
      imagen:"imagenes/control-xbox.svg",
      ahora:229000,
      antes:269000,
      color:"#107c10",
      emoji:"🟢",
      cat:"controles",
      etiqueta:"-15%",
      marca:"Microsoft",
      calidad:"Nuevo",
      descripcion:"Control compatible con Xbox Series y PC. Diseño ergonómico con agarre texturizado, botones traseros programables y compatibilidad total con Xbox Series X/S y Windows 10/11."
    }
  ],
  // Auriculares para gaming
  auriculares: [
    // Auriculares Gamer Pro: modelo básico sin descuento
    {
      nombre:"Auriculares Gamer Pro",
      imagen:"imagenes/auriculares.svg",
      ahora:189000,
      color:"#b44fff",
      emoji:"🎧",
      cat:"auriculares",
      marca:"Genérico",
      calidad:"Nuevo",
      descripcion:"Auriculares gaming básicos con buen aislamiento de ruido y drivers de 40mm. Ideales para sesiones de juego prolongadas con comodidad y un sonido equilibrado para graves agudos."
    },
    // Headset 7.1 inalámbrico: modelo premium en oferta
    {
      nombre:"Headset Inalámbrico 7.1",
      imagen:"imagenes/auriculares.svg",
      ahora:259000,
      antes:299000,
      color:"#b44fff",
      emoji:"🎧",
      cat:"auriculares",
      etiqueta:"-13%",
      marca:"Genérico",
      calidad:"Nuevo",
      descripcion:"Headset gaming inalámbrico con sonido 7.1 surround para una experiencia espacial completa. Micrófono con cancelación de ruido y hasta 20 horas de batería con carga rápida USB-C."
    }
  ],
  // Memorias y almacenamiento
  memorias: [
    // Tarjeta de memoria genérica de 512GB
    {
      nombre:"Tarjeta Memoria 512GB",
      imagen:"imagenes/memoria.svg",
      ahora:189000,
      color:"#00f5ff",
      emoji:"💾",
      cat:"memorias",
      marca:"Genérico",
      calidad:"Nuevo",
      descripcion:"Tarjeta de memoria flash de 512GB para expansión de almacenamiento. Compatible con PlayStation 5, Xbox Series y PC. Transferencia rápida de datos y diseño compacto para llevar a cualquier parte."
    },
    // SSD externo oficial Sony para PS5, en oferta
    {
      nombre:"SSD Externo 1TB PS5",
      imagen:"imagenes/memoria.svg",
      ahora:349000,
      antes:399000,
      color:"#00f5ff",
      emoji:"💾",
      cat:"memorias",
      etiqueta:"-12%",
      marca:"Sony",
      calidad:"Nuevo",
      descripcion:"SSD externo oficial Sony de 1TB optimizado para PlayStation 5 con velocidades de lectura hasta 5.5GB/s. Expande el almacenamiento interno de la consola para cientos de juegos PS5 con carga casi instantánea."
    }
  ],
  // Cargadores y bases de carga
  cargadores: [
    // Cargador dual USB-C genérico
    {
      nombre:"Cargador Dual USB-C",
      imagen:"imagenes/cargador.svg",
      ahora:79000,
      color:"#ffd700",
      emoji:"⚡",
      cat:"cargadores",
      marca:"Genérico",
      calidad:"Nuevo",
      descripcion:"Cargador dual USB-C con salida rápida de 30W para cargar simultáneamente dos dispositivos. Compacto y portátil, ideal para llevar a casa o de viaje con protección contra sobrecargas."
    },
    // Base de carga oficial Sony DualSense, en oferta
    {
      nombre:"Base Carga DualSense",
      imagen:"imagenes/cargador.svg",
      ahora:119000,
      antes:139000,
      color:"#ffd700",
      emoji:"⚡",
      cat:"cargadores",
      etiqueta:"-14%",
      marca:"Sony",
      calidad:"Nuevo",
      descripcion:"Base de carga oficial Sony DualSense para cargar dos controladores simultáneamente. Diseño compacto con indicadores LED y carga inteligente que optimiza la batería para prolongar su vida útil."
    }
  ],
  // Volantes y equipos de simulación (NUEVO SUBGRUPO)
  volantes: [
    // Volante con force feedback para PC y consola, en oferta
    {
      nombre:"Volante Racing Force",
      imagen:"imagenes/volante.svg",
      antes:399000,
      ahora:349000,
      color:"#cc0000",
      etiqueta:"-13%",
      emoji:"🏎️",
      cat:"volantes",
      marca:"Genérico",
      calidad:"Nuevo",
      especificaciones: ["Force Feedback", "Giro 900°", "Pedales incluidos", "Compatible PC/PS"],
      descripcion:"Volante de simulación con retroalimentación de fuerza que transmite la resistencia del asfalto y los baches en tiempo real. Incluye pedales de acelerador y freno, y un giro de 900° para derrapes precisos en juegos de carreras."
    },
    // Pedales independientes para simulación
    {
      nombre:"Pedales de Simulación Pro",
      imagen:"imagenes/volante.svg",
      ahora:219000,
      color:"#00f5ff",
      emoji:"🛞",
      cat:"volantes",
      marca:"Genérico",
      calidad:"Nuevo",
      especificaciones: ["3 pedales", "Sensor de presión", "Base antideslizante", "Ajuste de recorrido"],
      descripcion:"Juego de pedales de simulación con acelerador, freno y embrague. Su sensor de presión permite dosificar la frenada como en un coche real y la base antideslizante mantiene todo firme en las curvas más exigentes."
    },
    // Palanca de cambios secuencial / H-Pattern
    {
      nombre:"Palanca de Cambios H-Pattern",
      imagen:"imagenes/volante.svg",
      antes:179000,
      ahora:149000,
      color:"#b44fff",
      etiqueta:"-17%",
      emoji:"🕹️",
      cat:"volantes",
      marca:"Genérico",
      calidad:"Nuevo",
      especificaciones: ["Patrón en H", "6 marchas + reversa", "Montaje en escritorio", "USB plug & play"],
      descripcion:"Palanca de cambios con patrón en H y seis marchas más reversa para setups de simulación realistas. Se monta fácilmente en el escritorio y se conecta por USB sin instalar controladores adicionales."
    }
  ]
};

/* --- Videojuegos: agrupados por género ---
   Cada género es un array dentro del objeto videojuegos.
   El buscador usa estas categorías para filtrar por tipo de juego. */
const videojuegos = {
  // Juegos de acción
  accion: [
    // God of War Ragnarök: exclusivo PS5, en oferta
    {
      nombre:"God of War Ragnarök",
      imagen:"imagenes/juego-accion.svg",
      ahora:199000,
      antes:249000,
      color:"#cc0000",
      emoji:"⚔️",
      cat:"accion",
      etiqueta:"-20%",
      marca:"Sony",
      calidad:"Nuevo",
      descripcion:"God of War Ragnarök es una epopeya vikinga exclusiva de PS5, la secuela directa de God of War (2018). Sigue la historia de Kratos y su hijo Atreus en un viaje por los nueve reinos nórdicos, combinando combate cuerpo a cuerpo con magia antigua y exploración de mundo abierto."
    },
    // The Last of Us Part II: exclusivo PS, versión reacondicionada
    {
      nombre:"The Last of Us Part II",
      imagen:"imagenes/juego-accion2.svg",
      ahora:159000,
      color:"#003300",
      emoji:"🌿",
      cat:"accion",
      marca:"Sony",
      calidad:"Reacondicionado",
      descripcion:"The Last of Us Part II es la secuela directa del aclamado The Last of Us. Ambientado años después del primer juego, sigue a Ellie en un viaje de venganza y redención a través de un EE. UU. post-apocalíptico, explorando temas de pérdida, venganza y las consecuencias de nuestras acciones."
    }
  ],
  // Juegos de aventura
  aventura: [
    // Marvel's Spider-Man 2: exclusivo PS5, en oferta
    {
      nombre:"Marvel's Spider-Man 2",
      imagen:"imagenes/juego-aventura.svg",
      ahora:219000,
      antes:269000,
      color:"#003791",
      emoji:"🕷️",
      cat:"aventura",
      etiqueta:"-19%",
      marca:"Sony",
      calidad:"Nuevo",
      descripcion:"Marvel's Spider-Man 2 es la secuela directa de la aclamada saga de Spider-Man para PS5. Permite jugar como Peter Parker y Miles Morales, con nuevos trajes, poderes simbióticos y la capacidad de cambiar entre ambos héroes en un Nueva York abierto y detallado."
    },
    // Zelda Tears of the Kingdom: exclusivo Nintendo Switch
    {
      nombre:"Zelda: Tears of Kingdom",
      imagen:"imagenes/juego-aventura2.svg",
      ahora:199000,
      color:"#ccaa00",
      emoji:"🗡️",
      cat:"aventura",
      marca:"Nintendo",
      calidad:"Nuevo",
      descripcion:"The Legend of Zelda: Tears of the Kingdom es la secuela de Breath of the Wild. Amplía la fórmula de mundo abierto con nuevas mecánicas: poderes de la mano derecha para crear, manipular objetos y resolver puzzles ambientales en una búsqueda para rescatar a la princesa Zelda en un reino flotante y misterioso."
    }
  ],
  // Juegos de deportes
  deportes: [
    // EA Sports FC 25: sucesor del FIFA, en oferta
    {
      nombre:"EA Sports FC 25",
      imagen:"imagenes/juego-deportes.svg",
      ahora:169000,
      antes:219000,
      color:"#003a00",
      emoji:"⚽",
      cat:"deportes",
      etiqueta:"-23%",
      marca:"EA",
      calidad:"Nuevo",
      descripcion:"EA Sports FC 25 es la entrega anual de la franquicia futbolística, sucediendo al FIFA. Con mecánicas de juego renovadas, ligas actualizadas y nuevas características de juego en línea, ofrece la experiencia de fútbol más realista y completa para jugadores casuales y hardcore."
    },
    // NBA 2K25: simulador de baloncesto
    {
      nombre:"NBA 2K25",
      imagen:"imagenes/juego-deportes2.svg",
      ahora:149000,
      color:"#ff8800",
      emoji:"🏀",
      cat:"deportes",
      marca:"2K",
      calidad:"Nuevo",
      descripcion:"NBA 2K25 es la entrega anual de la franquicia de simulación de baloncesto más realista. Con gráficos mejorados, IA de jugadores más inteligente y modos de juego profundos, ofrece la experiencia definitiva de baloncesto para fans de la NBA y jugadores competitivos."
    }
  ],
  // Juegos infantiles / familiares
  infantiles: [
    // Mario Kart 8 Deluxe: juego familiar para Nintendo Switch
    {
      nombre:"Mario Kart 8 Deluxe",
      imagen:"imagenes/juego-infantil.svg",
      ahora:179000,
      color:"#2a003a",
      emoji:"🏎️",
      cat:"infantiles",
      marca:"Nintendo",
      calidad:"Nuevo",
      descripcion:"Mario Kart 8 Deluxe es el juego de carreras definitivo de Nintendo para Switch, con todos los circuitos y personajes de entregas anteriores más nuevo contenido. Con modo multijugador local y en línea, es perfecto para fiestas y competencias familiares con hasta 12 jugadores."
    },
    // Minecraft Bedrock: juego de construcción multiplataforma, en oferta
    {
      nombre:"Minecraft Bedrock",
      imagen:"imagenes/juego-infantil2.svg",
      ahora:99000,
      antes:129000,
      color:"#002222",
      emoji:"⛏️",
      cat:"infantiles",
      etiqueta:"-23%",
      marca:"Microsoft",
      calidad:"Nuevo",
      descripcion:"Minecraft Bedrock Edition es la versión multiplataforma del fenómeno de bloques. Juega en cualquier dispositivo con cross-play, construye mundos infinitos con bloques, explora mazmorras y sobrevive contra mobs. Ideal para todas las edades con posibilidades creativas infinitas."
    }
  ],
  // Juegos de terror (NUEVO SUBGRUPO)
  terror: [
    // Resident Evil 4 Remake, en oferta
    {
      nombre:"Resident Evil 4 Remake",
      imagen:"imagenes/juego-terror.svg",
      antes:289000,
      ahora:239000,
      color:"#cc0000",
      etiqueta:"-17%",
      emoji:"🧟",
      cat:"terror",
      marca:"Capcom",
      calidad:"Nuevo",
      especificaciones: ["Remake completo", "Modo historia", "Gráficos 4K", "Un jugador"],
      descripcion:"El clásico de terror y acción regresa con un remake completo: nuevos controles, iluminación realista y un pueblo infectado más aterrador que nunca. Acompaña a Leon Kennedy en una misión de rescate donde cada bala y cada rincón cuentan."
    },
    // Silent Hill 2 Remake
    {
      nombre:"Silent Hill 2 Remake",
      imagen:"imagenes/juego-terror.svg",
      ahora:259000,
      color:"#2a2060",
      emoji:"🌫️",
      cat:"terror",
      marca:"Konami",
      calidad:"Nuevo",
      especificaciones: ["Survival horror", "Cámara dinámica", "Audio envolvente", "Un jugador"],
      descripcion:"El survival horror psicológico más recordado vuelve con gráficos renovados y una niebla que esconde algo peor que los monstruos. Una historia inquietante sobre la culpa y la redención que se disfruta mejor con auriculares y luces apagadas."
    },
    // Dead Space Remake, en oferta
    {
      nombre:"Dead Space Remake",
      imagen:"imagenes/juego-terror.svg",
      antes:249000,
      ahora:199000,
      color:"#003300",
      etiqueta:"-20%",
      emoji:"👾",
      cat:"terror",
      marca:"EA",
      calidad:"Nuevo",
      especificaciones: ["Sci-fi horror", "Campaña completa", "Sonido 3D", "Un jugador"],
      descripcion:"Terror sci-fi a bordo de la nave Ishimura: desmembrar necromorfos es la única forma de sobrevivir. El remake reconstruye cada pasillo con sonido 3D y una atmósfera opresiva que mantiene la tensión de principio a fin."
    }
  ]
};

/* ============================================================
   UTILIDADES GENERALES
   ============================================================ */

// Atajo para document.getElementById — en vez de escribir getElementById cada vez
// (se define aquí porque el JS usa `$("id")` en todo el archivo)
// Se expone como global para que los listeners delegados también puedan usarlo
if (typeof window.$ !== "function") {
  window.$ = (id) => document.getElementById(id);
}

// Formatea un número como precio en pesos colombianos. Ejemplo: 449000 → "$449.000"
const moneda = (n) => "$" + n.toLocaleString("es-CO");

/**
 * Escapa caracteres especiales HTML para evitar ataques XSS.
 * Se usa siempre que se inserta texto del usuario dentro de innerHTML.
 * Convierte: & → &amp;  < → &lt;  > → &gt;  " → &quot;  ' → &#39;
 */
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")   // ampersand primero para no doble-escapar
    .replace(/</g, "&lt;")    // evita inyección de etiquetas HTML
    .replace(/>/g, "&gt;")    // cierra etiquetas abiertas
    .replace(/"/g, "&quot;")  // protege atributos entre comillas dobles
    .replace(/'/g, "&#39;");  // protege atributos entre comillas simples
}

/**
 * Lee la lista de cuentas guardadas en localStorage.
 * Valida que cada cuenta tenga correo, nombre y clave con formato correcto.
 * Si localStorage falla (modo privado), usa la variable global window.__cuentas.
 */
function leerCuentas(){
  try {
    const lista = JSON.parse(localStorage.getItem("cuentas")) || [];
    // Solo retorna cuentas con estructura válida (evita datos corruptos o manipulados)
    return Array.isArray(lista) ? lista.filter(c =>
      c && typeof c.correo === "string" && reCorreo.test(c.correo) &&
      typeof c.nombre === "string" && c.nombre.trim() &&
      typeof c.clave === "string" && c.clave.length >= 8
    ) : [];
  }
  catch(e){ return window.__cuentas || []; } // fallback si localStorage no está disponible
}

/**
 * Guarda la lista de cuentas en localStorage y también en window.__cuentas
 * como respaldo para entornos donde localStorage no funciona.
 */
function guardarCuentas(lista){
  window.__cuentas = lista;                                              // respaldo en memoria
  try { localStorage.setItem("cuentas", JSON.stringify(lista)); } catch(e){}
}

/* ============================================================
   TOGGLE MOSTRAR / OCULTAR CONTRASEÑA
   Escucha clics en cualquier botón con clase .toggle-clave.
   Cambia el tipo del input entre "password" y "text".
   ============================================================ */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".toggle-clave");       // busca el botón ojo más cercano
  if (!btn) return;                                     // si no hay botón, ignorar
  const input = $(btn.dataset.target);                  // obtiene el input al que apunta
  if (!input) return;
  const mostrar = input.type === "password";            // true si está oculta, false si está visible
  input.type = mostrar ? "text" : "password";           // alterna entre texto visible y oculto
  btn.textContent = mostrar ? "🙈" : "👁";             // cambia el ícono del botón
  btn.setAttribute("aria-label", mostrar ? "Ocultar contraseña" : "Mostrar contraseña");
});

/* ============================================================
   NAVEGACIÓN ENTRE VISTAS (pantallas)
   La app es de una sola página (SPA): todas las secciones
   existen en el HTML pero solo una tiene la clase "activa".
   ============================================================ */

// Títulos de la pestaña del navegador para cada vista
const TITULOS = {
  inicio:    "EcoMerce - Tienda de consolas",
  registro:  "EcoMerce - Registrarse",
  login:     "EcoMerce - Iniciar sesión",
  recuperar: "EcoMerce - Recuperar contraseña",
  principal: "EcoMerce - Tienda",
  detalle:   "EcoMerce - Detalle del producto",
  carrito:   "EcoMerce - Mi carrito",
  pedidos:   "EcoMerce - Mis pedidos"
};

/**
 * Muestra la vista con el nombre dado y oculta todas las demás.
 * También actualiza el título de la pestaña y hace scroll al inicio.
 * Si se navega a "principal", limpia el buscador para mostrar el inicio limpio.
 */
// Pila de navegación: permite que el botón "Atrás" regrese a la vista anterior.
const historialVistas = [];
let vistaActual = "inicio";
const scrollPorVista = {};

/**
 * Muestra la vista con el nombre dado y oculta todas las demás.
 * Guarda la vista anterior en una pila para que el botón "Atrás" funcione.
 *
 * @param {string} nombre - Nombre de la vista (inicio, login, principal, detalle...)
 * @param {Object} [opciones]
 * @param {boolean} [opciones.conservar] - No reinicia buscador/filtros al volver a la tienda
 * @param {boolean} [opciones.reiniciar] - Borra la pila de navegación (la vista pasa a ser raíz)
 * @param {boolean} [opciones.silencioso] - No agrega la vista actual a la pila (usado al retroceder)
 */
function mostrar(nombre, opciones = {}){
  const destino = $("vista-" + nombre);
  if (!destino) return;

  const esCambio = vistaActual !== nombre;

  // Recuerda la posición de scroll de la vista que se abandona
  if (esCambio) scrollPorVista[vistaActual] = window.scrollY;

  if (opciones.reiniciar) {
    historialVistas.length = 0;
  } else if (esCambio && !opciones.silencioso) {
    historialVistas.push(vistaActual);
    if (historialVistas.length > 30) historialVistas.shift();
  }

  // Quita la clase "activa" de todas las secciones
  document.querySelectorAll(".vista").forEach(v => v.classList.remove("activa"));
  // Agrega "activa" solo a la sección que corresponde al nombre
  destino.classList.add("activa");
  // Actualiza el título de la pestaña del navegador
  document.title = TITULOS[nombre] || "EcoMerce";

  // Si se vuelve a la tienda principal, limpiar el estado del buscador y filtros
  // (salvo cuando se regresa desde el detalle y queremos conservar los resultados)
  if (nombre === "principal" && !opciones.conservar) {
    reiniciarBusquedaYFiltros();
  }

  vistaActual = nombre;
  actualizarBotonAtras();

  // Restaura el scroll al volver a una vista anterior; si no, sube al inicio
  if (opciones.conservar && scrollPorVista[nombre] != null) {
    window.scrollTo(0, scrollPorVista[nombre]);
  } else {
    window.scrollTo(0,0);
  }
}

/** Limpia buscador, filtros y vuelve a mostrar el inicio de la tienda. */
function reiniciarBusquedaYFiltros(){
  const buscador = $("buscador");
  if (buscador) buscador.value = "";
  ["filtro-precio-min","filtro-precio-max","filtro-categoria",
   "filtro-marca","filtro-calidad","filtro-orden","orden-resultados"].forEach(id => {
    const el = $(id);
    if (el) el.value = "";
  });
  const avRango = $("aviso-rango-precio");
  if (avRango) avRango.hidden = true;
  const vb = $("vista-busqueda");
  const cp = $("contenido-principal");
  const panel = $("panel-filtros");
  if (vb) vb.hidden = true;
  if (cp) cp.hidden = false;
  if (panel) panel.hidden = true;
}

/** Muestra u oculta el botón global de retroceso. */
function actualizarBotonAtras(){
  const btn = $("btn-atras-global");
  if (!btn) return;
  const visible = vistaActual !== "inicio" && historialVistas.length > 0;
  btn.hidden = !visible;
  btn.classList.toggle("visible", visible);
}

/** Regresa a la vista anterior de la pila (o al inicio si no hay historial). */
function irAtras(){
  while (historialVistas.length) {
    const anterior = historialVistas.pop();
    if (anterior && anterior !== vistaActual && $("vista-" + anterior)) {
      mostrar(anterior, { silencioso: true, conservar: true });
      return;
    }
  }
  mostrar("inicio", { silencioso: true, reiniciar: true });
}

// Botón flotante "Atrás" + atajo de teclado Alt + ←
$("btn-atras-global").addEventListener("click", irAtras);
document.addEventListener("keydown", (e) => {
  if (e.altKey && e.key === "ArrowLeft") {
    e.preventDefault();
    if (vistaActual !== "inicio") irAtras();
  }
});

// Listener global: cualquier elemento con data-ir="X" navega a la vista X al hacer clic
document.addEventListener("click", (e) => {
  const destino = e.target.closest("[data-ir]");
  if(destino){
    $("aviso-registro").hidden = true;  // oculta avisos de sesiones anteriores
    $("aviso-login").hidden    = true;
    mostrar(destino.dataset.ir);        // navega a la vista indicada en data-ir
  }
});

// Permite navegar con Enter en enlaces <a data-ir="..."> para accesibilidad de teclado
document.addEventListener("keydown", (e) => {
  if(e.key === "Enter" && e.target.matches("a[data-ir]")) e.target.click();
});

/* ============================================================
   VALIDACIÓN DE FORMULARIOS
   Todas las funciones retornan true si el campo es válido,
   false si hay error. También marcan visualmente el campo.
   ============================================================ */

/**
 * Marca un campo como válido o inválido y muestra el mensaje de error.
 * @param {HTMLInputElement} input - El campo que se va a validar
 * @param {string} mensaje - Texto de error. Si está vacío, el campo es válido.
 * @returns {boolean} true si no hay error, false si hay error
 */
function marcar(input, mensaje){
  const campo = input.closest(".campo");                              // contenedor padre del input
  campo.querySelector(".msg-error").textContent = mensaje;           // muestra u oculta el error
  campo.classList.toggle("invalido", !!mensaje);                     // borde rojo si hay error
  campo.classList.toggle("valido",   !mensaje && input.value !== ""); // borde verde si está correcto
  return !mensaje;                                                    // retorna true = válido
}

// Expresión regular para validar correos electrónicos
// Formato: algo@algo.dominio (mínimo 2 caracteres de dominio)
const reCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Valida que el correo no esté vacío y tenga formato válido */
function validarCorreo(i){
  if(!i.value.trim()) return marcar(i, "Escribe tu correo.");
  if(!reCorreo.test(i.value.trim())) return marcar(i, "El correo no es válido. Ejemplo: nombre@correo.com");
  return marcar(i, "");   // sin mensaje = válido
}

/** Valida que el nombre tenga al menos dos palabras (nombre y apellido) */
function validarNombre(i){
  const v = i.value.trim();
  if(!v) return marcar(i, "Escribe tu nombre y apellido.");
  if(v.split(/\s+/).length < 2) return marcar(i, "Escribe al menos un nombre y un apellido.");
  return marcar(i, "");
}

/** Valida que la contraseña tenga mínimo 8 caracteres con letras y números */
function validarClave(i){
  if(!i.value) return marcar(i, "Escribe una contraseña.");
  if(i.value.length < 8) return marcar(i, "Usa mínimo 8 caracteres.");
  if(!/[A-Za-z]/.test(i.value) || !/\d/.test(i.value)) return marcar(i, "Combina letras y números.");
  return marcar(i, "");
}

/** Valida que la confirmación de contraseña sea igual al campo #clave */
function validarConfirmacion(i){
  if(!i.value) return marcar(i, "Confirma tu contraseña.");
  if(i.value !== $("clave").value) return marcar(i, "Las contraseñas no coinciden.");
  return marcar(i, "");
}

// Validación en tiempo real: cuando el usuario sale de un campo (blur)
// se valida y se muestra el error inmediatamente
$("correo").addEventListener("blur", e => validarCorreo(e.target));
$("nombre").addEventListener("blur", e => validarNombre(e.target));
$("clave").addEventListener("blur",  e => validarClave(e.target));
$("clave2").addEventListener("blur", e => validarConfirmacion(e.target));

// Mientras el usuario escribe, si el campo ya tenía error, lo re-valida en vivo
["correo","nombre","clave","clave2"].forEach(id => {
  $(id).addEventListener("input", () => {
    // Solo re-valida si el campo ya estaba marcado como inválido
    if($(id).closest(".campo").classList.contains("invalido")){
      // Mapeo de id → función de validación correspondiente
      ({correo:validarCorreo, nombre:validarNombre, clave:validarClave, clave2:validarConfirmacion})[id]($(id));
    }
  });
});

/* ==============================================================================
   FLUJO DE REGISTRO DE USUARIOS
   El registro es un flujo de validación estricta que garantiza la integridad de
   los datos antes de persistirlos en el storage local:
   1. Validación de cada campo individualmente (nombre, correo, contraseña, confirmación)
   2. Validación de unicidad de correo (no permite duplicados)
   3. Persistencia segura en LocalStorage
   4. Inicio de sesión automática (no requiere login posterior)
   5. Notificación de que laPersistencia de la sesión no está activada por defecto
   ============================================================================== */
/* ============================================================
   REGISTRO DE USUARIO
   Valida todos los campos, verifica que el correo no exista,
   guarda la cuenta en localStorage y entra a la tienda.
   ============================================================ */
$("form-registro").addEventListener("submit", (e) => {
  e.preventDefault(); // evita que el formulario recargue la página

  // Valida todos los campos y guarda los resultados (true/false)
  const ok = [
    validarCorreo($("correo")),
    validarNombre($("nombre")),
    validarClave($("clave")),
    validarConfirmacion($("clave2"))
  ].every(Boolean); // every() retorna true solo si todos son true

  // Si algún campo es inválido, enfoca el primero con error y detiene el proceso
  if(!ok){ document.querySelector("#form-registro .invalido input").focus(); return; }

  // Normaliza el correo a minúsculas para comparaciones consistentes
  const correo  = $("correo").value.trim().toLowerCase();
  const cuentas = leerCuentas();

  // Verifica que no exista otra cuenta con el mismo correo
  if(cuentas.some(c => c.correo === correo)){
    marcar($("correo"), "Este correo ya tiene una cuenta. Inicia sesión.");
    $("correo").focus();
    return;
  }

  // Crea el objeto de cuenta con los datos del formulario
  const cuenta = { correo, nombre: $("nombre").value.trim(), clave: $("clave").value };
  cuentas.push(cuenta);        // agrega la nueva cuenta a la lista
  guardarCuentas(cuentas);     // guarda en localStorage

  // Limpia el formulario y los estilos de validación
  e.target.reset();
  e.target.querySelectorAll(".campo").forEach(c => c.classList.remove("valido","invalido"));

  // Avisa que la sesión no se guardará (no marcó "Mantener sesión")
  mostrarToastSesion();

  entrar(cuenta); // va directamente a la tienda sin pasar por login
});

/* ============================================================
   INICIO DE SESIÓN
   Verifica correo y contraseña contra las cuentas guardadas.
   Si "Mantener sesión" está marcado, guarda el correo en
   localStorage para no pedir credenciales al recargar.
   ============================================================ */
$("form-login").addEventListener("submit", (e) => {
  e.preventDefault();
  const c = $("login-correo"), p = $("login-clave");

  // Validación básica: campos no vacíos
  marcar(c, c.value.trim() ? "" : "Escribe tu correo.");
  marcar(p, p.value       ? "" : "Escribe tu contraseña.");
  if(!c.value.trim() || !p.value) return; // detener si hay campo vacío

  const aviso = $("aviso-login");
  aviso.hidden = true; // ocultar avisos de intentos anteriores

  // Busca la cuenta por correo (comparación en minúsculas)
  const cuenta = leerCuentas().find(x => x.correo === c.value.trim().toLowerCase());

  // Error 1: el correo no existe en la base de datos
  if(!cuenta){
    marcar(c, "Correo no registrado.");
    aviso.textContent = 'No existe una cuenta con ese correo. Revísalo o regístrate.';
    aviso.hidden = false;
    p.value = ""; // limpia la contraseña por seguridad
    c.focus();
    return;
  }

  // Error 2: la contraseña no coincide
  if(cuenta.clave !== p.value){
    marcar(p, "Contraseña incorrecta.");
    aviso.textContent = 'La contraseña es incorrecta. Inténtalo de nuevo o usa "¿Olvidó su contraseña?".';
    aviso.hidden = false;
    p.value = ""; // limpia la contraseña por seguridad
    p.focus();
    return;
  }

  // Si marcó "Mantener sesión", guarda el correo para auto-login en próximas visitas
  try {
    if($("mantener").checked) localStorage.setItem("sesion", cuenta.correo);
    else localStorage.removeItem("sesion"); // si no, elimina cualquier sesión guardada
  } catch(err){}

  // Limpia el formulario y los estilos
  e.target.reset();
  e.target.querySelectorAll(".campo").forEach(x => x.classList.remove("valido","invalido"));
  entrar(cuenta); // entra a la tienda
});

/* ============================================================
   PÁGINA PRINCIPAL — TARJETA Y FUNCIÓN ENTRAR
   ============================================================ */

/**
 * Promedio de estrellas de un producto (o null si aún no tiene opiniones).
 * Se usa en las tarjetas y para ordenar por "Mejor valorados".
 */
function promedioProducto(p) {
  return calcularPromedio(claveProducto(p.nombre));
}

/**
 * Genera el HTML de una tarjeta de producto.
 * Estructura uniforme estilo Amazon / Mercado Libre:
 * imagen en un marco fijo, marca, nombre (2 líneas), precio,
 * calificación y botón "Agregar" siempre alineado abajo.
 * @param {Object} p - Objeto producto con todas sus propiedades
 * @param {number} i - Posición para el retardo de la animación
 * @returns {string} HTML de la tarjeta como string
 */
function tarjeta(p, i = 0){
  const rating = promedioProducto(p);
  const calificacion = rating
    ? `<span class="producto-estrellas" aria-hidden="true">${estrellasHTML(Math.round(rating.promedio))}</span>
       <span class="producto-rating-num">${rating.promedio}</span>
       <span class="producto-rating-total">(${rating.total})</span>`
    : `<span class="producto-rating-vacio">Sin opiniones</span>`;

  // --i controla el orden de aparición escalonado de cada tarjeta
  return `<article class="producto" style="--i:${Math.min(i, 8)}">
    ${p.etiqueta ? `<span class="etiqueta">${p.etiqueta}</span>` : ""}
    <div class="producto-media">
      <img class="foto" src="${p.imagen}" alt="${p.nombre}" loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="icono" style="display:none;background:${p.color};font-size:2.5rem">${p.emoji}</div>
      <span class="producto-brillo" aria-hidden="true"></span>
    </div>
    <div class="producto-cuerpo">
      <span class="producto-marca">${p.marca} · ${p.calidad}</span>
      <h4>${p.nombre}</h4>
      <p class="precio">
        <span class="precio-ahora">${moneda(p.ahora)}</span>
        ${p.antes ? `<s class="precio-antes">${moneda(p.antes)}</s>` : ""}
      </p>
      <div class="producto-rating">${calificacion}</div>
      <button class="btn-carrito-tarjeta" data-nombre="${p.nombre}" type="button"
              aria-label="Agregar ${p.nombre} al carrito">🛒 Agregar</button>
    </div>
  </article>`;
}

/* ============================================================
   CATÁLOGO AGRUPADO (estilo Amazon / Mercado Libre)
   Cada categoría tiene su propia sección ordenada. Los grupos
   grandes (Accesorios y Videojuegos) contienen subgrupos.
   ============================================================ */
const GRUPOS_TIENDA = [
  {
    tipo: "destacado", id: "ofertas", titulo: "🔥 Ofertas del día",
    meta: "Los mejores descuentos", items: () => ofertas, accion: "ofertas"
  },
  {
    tipo: "destacado", id: "consolas", titulo: "🎮 Consolas",
    meta: "Nuevas y retro", items: () => nuevos
  },
  {
    tipo: "super", id: "accesorios", titulo: "🕹️ Accesorios",
    meta: "Completa tu setup",
    subgrupos: [
      { id: "controles",   titulo: "Controles",              items: () => accesorios.controles },
      { id: "auriculares", titulo: "Auriculares",            items: () => accesorios.auriculares },
      { id: "memorias",    titulo: "Memorias y almacenamiento", items: () => accesorios.memorias },
      { id: "cargadores",  titulo: "Cargadores y bases",     items: () => accesorios.cargadores },
      { id: "volantes",    titulo: "Volantes y simulación",  items: () => accesorios.volantes }
    ]
  },
  {
    tipo: "super", id: "videojuegos", titulo: "👾 Videojuegos",
    meta: "Organizados por género",
    subgrupos: [
      { id: "accion",     titulo: "Acción",     items: () => videojuegos.accion },
      { id: "aventura",   titulo: "Aventura",   items: () => videojuegos.aventura },
      { id: "deportes",   titulo: "Deportes",   items: () => videojuegos.deportes },
      { id: "infantiles", titulo: "Infantiles", items: () => videojuegos.infantiles },
      { id: "terror",     titulo: "Terror",     items: () => videojuegos.terror }
    ]
  }
];

/**
 * HTML de una estantería: título + botón "Ver todos" + grilla de tarjetas.
 * @param {Object} grupo - Subgrupo con id, titulo e items()
 * @param {boolean} destacado - Título más grande (Ofertas / Consolas)
 */
function htmlEstanteria(grupo, destacado = false){
  const items = grupo.items();
  if (!items.length) return "";

  const accion = grupo.accion === "ofertas"
    ? `<button class="grupo-ver" type="button" data-ver-ofertas>Ver todos <span aria-hidden="true">→</span></button>`
    : `<button class="grupo-ver" type="button" data-filtro-cat="${grupo.id}">Ver todos <span aria-hidden="true">→</span></button>`;

  return `<section class="grupo-productos${destacado ? " grupo-productos--destacado" : ""}" id="estanteria-${grupo.id}">
    <div class="grupo-cabeza">
      <h3>${grupo.titulo}</h3>
      ${accion}
    </div>
    <div class="grilla">${items.map((p, i) => tarjeta(p, i)).join("")}</div>
  </section>`;
}

/** Construye todo el catálogo agrupado dentro de #grupos-tienda. */
function renderizarGruposTienda(){
  const cont = $("grupos-tienda");
  if (!cont) return;

  cont.innerHTML = GRUPOS_TIENDA.map(g => {
    if (g.tipo !== "super") return htmlEstanteria(g, true);

    const total = g.subgrupos.reduce((s, sg) => s + sg.items().length, 0);
    return `<section class="grupo-super" id="grupo-${g.id}" aria-label="${g.titulo}">
      <div class="grupo-super-cabeza">
        <h2>${g.titulo}</h2>
        <span class="grupo-super-meta">${g.meta} · ${total} productos</span>
      </div>
      <div class="grupo-super-cuerpo">
        ${g.subgrupos.map(sg => htmlEstanteria(sg)).join("")}
      </div>
    </section>`;
  }).join("");
}

/**
 * Anima la aparición de las tarjetas cuando entran en pantalla.
 * Si el navegador no soporta IntersectionObserver, se muestran de una vez.
 * @param {HTMLElement} contenedor - Grilla con tarjetas .producto
 */
function animarAparicion(contenedor){
  if (!contenedor) return;
  const nuevas = [...contenedor.querySelectorAll(".producto:not(.aparece)")];
  if (!nuevas.length) return;

  if (!("IntersectionObserver" in window)) {
    nuevas.forEach(c => c.classList.add("aparece", "visible"));
    return;
  }

  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add("visible"); // dispara la animación CSS
      obs.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  nuevas.forEach(c => {
    c.classList.add("aparece"); // oculta hasta que entre en pantalla
    observador.observe(c);
  });
}

/**
 * Inicializa la vista de la tienda para el usuario que acaba de entrar.
 * - Limpia el carrito si es un usuario diferente al anterior
 * - Renderiza los productos en los paneles
 * - Activa los listeners de tarjetas y carrito
 * - Muestra los enlaces de Mis pedidos y Salir en el header
 * @param {Object} cuenta - Objeto con correo, nombre y clave del usuario
 */
function entrar(cuenta){
  // Usuario que estaba en memoria antes de iniciar esta sesión
  const usuarioAnterior = window.__usuarioLogueado;

  // Guardar usuario en memoria global para evitar problemas de persistencia en localStorage
  window.__usuarioLogueado = cuenta;

  // Si entra un usuario distinto al anterior, limpiar su carrito
  let sesionAnterior = null;
  try { sesionAnterior = localStorage.getItem("sesion"); } catch(e) {}
  if ((usuarioAnterior && usuarioAnterior.correo !== cuenta.correo) ||
      (sesionAnterior && sesionAnterior !== cuenta.correo)) {
    guardarCarrito([]); // evita que el nuevo usuario vea el carrito del anterior
  }

  const primerNombre = cuenta.nombre.split(" ")[0]; // solo el primer nombre para el saludo
  $("saludo").textContent = "Hola, " + primerNombre;

  // Renderiza el catálogo completo agrupado por categorías
  renderizarGruposTienda();

  // Activa clics en tarjetas, botones "Agregar" y animaciones de aparición
  reactivarGrillas();

  // Construye los enlaces del header: nombre · Mis pedidos · Salir
  const sesionEl = $("sesion");
  if(sesionEl){
    sesionEl.innerHTML = `${primerNombre} · <a href="#" id="mis-pedidos-link" style="color:#00f5ff">Mis pedidos</a> · <a href="#" id="salir" style="color:#ffd700">Salir</a>`;

    // Botón "Salir": elimina la sesión, limpia el carrito y vuelve al inicio
    const salirEl = $("salir");
    if(salirEl) salirEl.addEventListener("click", (ev) => {
      ev.preventDefault();
      try{ localStorage.removeItem("sesion"); }catch(err){}
      window.__usuarioLogueado = null;          // cierra la sesión en memoria
      guardarCarrito([]);                       // limpiar carrito al cerrar sesión
      actualizarBadge();
      sesionEl.innerHTML = "";
      mostrar("inicio", { reiniciar: true });   // el inicio pasa a ser la raíz
    });

    // Enlace "Mis pedidos": carga y muestra los pedidos del usuario actual
    const pedidosLink = $("mis-pedidos-link");
    if(pedidosLink) pedidosLink.addEventListener("click", (ev) => {
      ev.preventDefault();
      renderPedidos();
      mostrar("pedidos");
    });
  }
  mostrar("principal", { reiniciar: true }); // la tienda pasa a ser la raíz de navegación
}

/* ============================================================
   BUSCADOR Y FILTROS
   ============================================================ */

/**
 * Retorna todos los productos de la tienda en un solo array plano.
 * Combina: ofertas + nuevos + accesorios (4 tipos) + videojuegos (4 géneros)
 * Se usa para buscar y filtrar en toda la tienda.
 */
const todosLosProductos = () => [
  ...ofertas,                   // consolas en oferta
  ...nuevos,                    // consolas nuevas y retro
  ...accesorios.controles,      // controles de juego
  ...accesorios.auriculares,    // auriculares gaming
  ...accesorios.memorias,       // memorias y SSDs
  ...accesorios.cargadores,     // cargadores y bases
  ...accesorios.volantes,       // volantes y simulación
  ...videojuegos.accion,        // juegos de acción
  ...videojuegos.aventura,      // juegos de aventura
  ...videojuegos.deportes,      // juegos de deportes
  ...videojuegos.infantiles,    // juegos infantiles
  ...videojuegos.terror         // juegos de terror
];

// Mapa de códigos de categoría a nombres legibles para mostrar en la UI
const LABEL_CAT = {
  consolas:"Consolas", controles:"Controles", auriculares:"Auriculares",
  memorias:"Memorias", cargadores:"Cargadores", volantes:"Volantes",
  accion:"Acción", aventura:"Aventura", deportes:"Deportes", infantiles:"Infantiles",
  terror:"Terror"
};

/* ============================================================
   BUSCADOR INTELIGENTE — MAPA DE SINÓNIMOS
   Cuando el usuario busca una palabra clave, el sistema la
   expande a categorías, marcas o términos relacionados.
   Por ejemplo: "ps5" → busca en marca Sony con término "ps5"
                "barato" → ordena de menor a mayor precio
                "retro" → filtra consolas usadas
   ============================================================ */
const SINONIMOS = {
  // Categorías generales
  consolas:      { cats: ["consolas"] },
  consola:       { cats: ["consolas"] },
  "video juego": { cats: ["accion","aventura","deportes","infantiles","terror"] },
  videojuego:    { cats: ["accion","aventura","deportes","infantiles","terror"] },
  videojuegos:   { cats: ["accion","aventura","deportes","infantiles","terror"] },
  juego:         { cats: ["accion","aventura","deportes","infantiles","terror"] },
  juegos:        { cats: ["accion","aventura","deportes","infantiles","terror"] },
  accesorios:    { cats: ["controles","auriculares","memorias","cargadores","volantes"] },
  accesorio:     { cats: ["controles","auriculares","memorias","cargadores","volantes"] },
  // Subcategorías
  control:       { cats: ["controles"] },
  controles:     { cats: ["controles"] },
  mando:         { cats: ["controles"] },
  mandos:        { cats: ["controles"] },
  joystick:      { cats: ["controles"] },
  auricular:     { cats: ["auriculares"] },
  auriculares:   { cats: ["auriculares"] },
  headset:       { cats: ["auriculares"] },
  audifonos:     { cats: ["auriculares"] },
  audífonos:     { cats: ["auriculares"] },
  memoria:       { cats: ["memorias"] },
  memorias:      { cats: ["memorias"] },
  ssd:           { cats: ["memorias"] },
  almacenamiento:{ cats: ["memorias"] },
  cargador:      { cats: ["cargadores"] },
  cargadores:    { cats: ["cargadores"] },
  base:          { cats: ["cargadores"] },
  // Volantes y simulación (nuevo subgrupo de accesorios)
  volante:       { cats: ["volantes"] },
  volantes:      { cats: ["volantes"] },
  racing:        { cats: ["volantes"] },
  carreras:      { cats: ["volantes"] },
  simulacion:    { cats: ["volantes"] },
  simulación:    { cats: ["volantes"] },
  pedales:       { cats: ["volantes"] },
  // Géneros de juegos
  accion:        { cats: ["accion"] },
  acción:        { cats: ["accion"] },
  aventura:      { cats: ["aventura"] },
  deporte:       { cats: ["deportes"] },
  deportes:      { cats: ["deportes"] },
  futbol:        { cats: ["deportes"] },
  fútbol:        { cats: ["deportes"] },
  basquet:       { cats: ["deportes"] },
  infantil:      { cats: ["infantiles"] },
  infantiles:    { cats: ["infantiles"] },
  niños:         { cats: ["infantiles"] },
  ninos:         { cats: ["infantiles"] },
  // Terror (nuevo subgrupo de videojuegos)
  terror:        { cats: ["terror"] },
  terrorifico:   { cats: ["terror"] },
  terrorífico:   { cats: ["terror"] },
  miedo:         { cats: ["terror"] },
  zombie:        { cats: ["terror"] },
  zombies:       { cats: ["terror"] },
  // Marcas
  sony:          { marcas: ["Sony"] },
  playstation:   { marcas: ["Sony"] },
  ps5:           { marcas: ["Sony"], terminos: ["ps5","playstation 5"] },
  ps4:           { marcas: ["Sony"], terminos: ["ps4","playstation 4"] },
  ps2:           { marcas: ["Sony"], terminos: ["ps2","playstation 2"] },
  microsoft:     { marcas: ["Microsoft"] },
  xbox:          { marcas: ["Microsoft"] },
  nintendo:      { marcas: ["Nintendo"] },
  switch:        { marcas: ["Nintendo"], terminos: ["switch"] },
  sega:          { marcas: ["Sega"] },
  capcom:        { marcas: ["Capcom"] },
  konami:        { marcas: ["Konami"] },
  genesis:       { marcas: ["Sega"], terminos: ["genesis"] },
  "mario kart":  { marcas: ["Nintendo"], terminos: ["mario"] },
  mario:         { marcas: ["Nintendo"], terminos: ["mario"] },
  zelda:         { marcas: ["Nintendo"], terminos: ["zelda"] },
  minecraft:     { marcas: ["Microsoft"], terminos: ["minecraft"] },
  spiderman:     { marcas: ["Sony"], terminos: ["spider"] },
  "spider man":  { marcas: ["Sony"], terminos: ["spider"] },
  "god of war":  { marcas: ["Sony"], terminos: ["god of war"] },
  "resident evil": { marcas: ["Capcom"], terminos: ["resident evil"] },
  "silent hill":   { marcas: ["Konami"], terminos: ["silent hill"] },
  "dead space":    { marcas: ["EA"], terminos: ["dead space"] },
  // Calidades
  nuevo:         { calidades: ["Nuevo"] },
  nuevos:        { calidades: ["Nuevo"] },
  usado:         { calidades: ["Usado"] },
  usados:        { calidades: ["Usado"] },
  reacondicionado:  { calidades: ["Reacondicionado"] },
  reacondicionados: { calidades: ["Reacondicionado"] },
  // Precio / oferta
  oferta:        { enOferta: true },
  ofertas:       { enOferta: true },
  descuento:     { enOferta: true },
  barato:        { ordenar: "asc" },
  baratos:       { ordenar: "asc" },
  economico:     { ordenar: "asc" },
  económico:     { ordenar: "asc" },
  caro:          { ordenar: "desc" },
  caros:         { ordenar: "desc" },
  retro:         { cats: ["consolas"], calidades: ["Usado"] },
  clasico:       { cats: ["consolas"], calidades: ["Usado"] },
  clásico:       { cats: ["consolas"], calidades: ["Usado"] },
};

/**
 * Interpreta la consulta de búsqueda del usuario extrayendo intenciones,
 * categorías, marcas y términos específicos a través de un motor de sinónimos.
 *
 * @param {string} q - La cadena de texto ingresada por el usuario en el buscador
 * @returns {Object} Un objeto con conjuntos de categorías, marcas, calidades y términos a filtrar
 */
function interpretarBusqueda(q) {
  const palabras = q.toLowerCase().trim().split(/\s+/);
  const cats     = new Set();
  const marcas   = new Set();
  const calidades= new Set();
  const terminos = new Set();
  let enOferta   = false;
  let ordenar    = null;
  let coincidioSinonimo = false;

  // Buscar frases completas primero (hasta 3 palabras)
  for (let len = 3; len >= 1; len--) {
    for (let i = 0; i <= palabras.length - len; i++) {
      const frase = palabras.slice(i, i + len).join(" ");
      if (SINONIMOS[frase]) {
        const s = SINONIMOS[frase];
        coincidioSinonimo = true;
        (s.cats      || []).forEach(c => cats.add(c));
        (s.marcas    || []).forEach(m => marcas.add(m));
        (s.calidades || []).forEach(k => calidades.add(k));
        (s.terminos  || []).forEach(t => terminos.add(t));
        if (s.enOferta) enOferta = true;
        if (s.ordenar) ordenar = s.ordenar;
      }
    }
  }

  return { cats, marcas, calidades, terminos, enOferta, ordenar, coincidioSinonimo };
}

/**
 * Función núcleo que se ejecuta cada vez que cambia el buscador o un filtro.
 * Realiza las siguientes operaciones:
 * 1. Obtiene los valores de todos los controles de filtrado (inputs, selects).
 * 2. Valida la lógica de negocio (ej: rango de precios coherente).
 * 3. Ejecuta la búsqueda inteligente si hay texto ingresado.
 * 4. Filtra el catálogo completo basándose en criterios intersectados (AND).
 * 5. Ordena los resultados según la selección del usuario.
 * 6. Renderiza los productos en la vista de búsqueda y gestiona la visibilidad
 *    de los paneles de la interfaz.
 */
function aplicarFiltros() {
  const q         = ($("buscador").value || "").trim().toLowerCase();
  const precioMin = parseInt($("filtro-precio-min").value) || 0;
  const precioMax = parseInt($("filtro-precio-max").value) || Infinity;
  const catFiltro = $("filtro-categoria").value;
  const marcaFiltro = $("filtro-marca").value;
  const calidadFiltro = $("filtro-calidad").value;

  // Mantiene sincronizado el selector de orden de la barra de resultados
  if ($("orden-resultados") && $("filtro-orden")) {
    $("orden-resultados").value = $("filtro-orden").value;
  }

  // Validar rango de precio
  const minEl = $("filtro-precio-min");
  const maxEl = $("filtro-precio-max");
  const avisoRango = $("aviso-rango-precio");
  if (minEl.value && maxEl.value && precioMin > precioMax) {
    if (avisoRango) avisoRango.hidden = false;
    return;
  }
  if (avisoRango) avisoRango.hidden = true;

  const vistaBusqueda = $("vista-busqueda");
  const contenido     = $("contenido-principal");
  const sinRes        = $("sin-resultados");
  let   resGrilla     = $("resultados-busqueda");
  const txtBusqueda   = $("txt-busqueda");

  const hayFiltro = q || catFiltro || marcaFiltro || calidadFiltro ||
                    minEl.value || maxEl.value;

  if (!hayFiltro) {
    vistaBusqueda.hidden = true;
    contenido.hidden = false;
    $("panel-filtros").hidden = true; // ocultar filtros al volver al inicio
    return;
  }

  // Mostrar panel de filtros lateral al buscar
  $("panel-filtros").hidden = false;

  // Interpretar búsqueda inteligente
  const interp = q ? interpretarBusqueda(q) : { cats: new Set(), marcas: new Set(), calidades: new Set(), terminos: new Set(), coincidioSinonimo: false, enOferta: false, ordenar: null };

  let resultados = todosLosProductos().filter(p => {
    // Filtros de panel (siempre se aplican si están activos)
    if (p.ahora < precioMin) return false;
    if (p.ahora > precioMax) return false;
    if (catFiltro && p.cat !== catFiltro) return false;
    if (marcaFiltro && p.marca !== marcaFiltro) return false;
    if (calidadFiltro && p.calidad !== calidadFiltro) return false;

    // Si hay texto de búsqueda
    if (q) {
      // Si hubo coincidencia con sinónimos, filtrar por los criterios expandidos
      if (interp.coincidioSinonimo) {
        const matchCat     = interp.cats.size === 0      || interp.cats.has(p.cat);
        const matchMarca   = interp.marcas.size === 0    || interp.marcas.has(p.marca);
        const matchCalidad = interp.calidades.size === 0 || interp.calidades.has(p.calidad);
        const matchTermino = interp.terminos.size === 0  || [...interp.terminos].some(t => p.nombre.toLowerCase().includes(t));
        const matchOferta  = !interp.enOferta            || !!p.etiqueta;

        // Debe cumplir al menos los criterios activos
        const critCat     = interp.cats.size > 0      ? matchCat     : true;
        const critMarca   = interp.marcas.size > 0    ? matchMarca   : true;
        const critCalidad = interp.calidades.size > 0 ? matchCalidad : true;
        const critTermino = interp.terminos.size > 0  ? matchTermino : true;
        const critOferta  = interp.enOferta           ? matchOferta  : true;

        if (!critCat || !critMarca || !critCalidad || !critTermino || !critOferta) return false;
      } else {
        // Búsqueda libre: busca en nombre, marca, categoría y calidad
        const haystack = `${p.nombre} ${p.marca} ${p.cat} ${p.calidad}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
    }

    return true;
  });

  // Ordenar por select lateral (además del inteligente por texto)
  const ordenSelect = $("filtro-orden") ? $("filtro-orden").value : "";
  if (ordenSelect === "asc")    resultados.sort((a,b) => a.ahora - b.ahora);
  if (ordenSelect === "desc")   resultados.sort((a,b) => b.ahora - a.ahora);
  if (ordenSelect === "rating") resultados.sort((a,b) => {
    const ra = promedioProducto(a), rb = promedioProducto(b);
    return (rb ? Number(rb.promedio) : 0) - (ra ? Number(ra.promedio) : 0);
  });
  if (ordenSelect === "nombre") resultados.sort((a,b) => a.nombre.localeCompare(b.nombre, "es"));
  // Si no hay orden en select, usar el del buscador inteligente
  if (!ordenSelect) {
    if (interp.ordenar === "asc")  resultados.sort((a,b) => a.ahora - b.ahora);
    if (interp.ordenar === "desc") resultados.sort((a,b) => b.ahora - a.ahora);
  }

  // Construir etiqueta descriptiva del resultado
  const partes = [];
  if (q) partes.push(`"${q}"`);
  if (catFiltro)      partes.push(LABEL_CAT[catFiltro] || catFiltro);
  if (marcaFiltro)    partes.push(marcaFiltro);
  if (calidadFiltro)  partes.push(calidadFiltro);
  if (minEl.value || maxEl.value) {
    const min = minEl.value ? moneda(precioMin) : "0";
    const max = maxEl.value ? moneda(precioMax) : "∞";
    partes.push(`${min} – ${max}`);
  }
  txtBusqueda.textContent = partes.join(" · ");

  resGrilla.innerHTML = resultados.map(tarjeta).join("");
  // Clonar nodo para eliminar listeners acumulados antes de agregar los nuevos
  const resGrillaFresh = resGrilla.cloneNode(true);
  resGrilla.parentNode.replaceChild(resGrillaFresh, resGrilla);
  activarTarjetas(resGrillaFresh, "principal");
  activarBotonesCarritoEnGrilla(resGrillaFresh);
  sinRes.hidden = resultados.length > 0;
  vistaBusqueda.hidden = false;
  contenido.hidden = true;
  animarAparicion(resGrillaFresh); // anima cada tarjeta cuando entra en pantalla

  // Contador de resultados con descripción del tipo de búsqueda
  const contador = $("contador-resultados");
  if (contador) {
    let desc = "";
    if (interp.coincidioSinonimo && q) {
      if (interp.cats.size > 0) {
        const cats = [...interp.cats].map(c => LABEL_CAT[c] || c).join(", ");
        desc = ` en ${cats}`;
      }
      if (interp.marcas.size > 0) desc += ` de ${[...interp.marcas].join(", ")}`;
      if (interp.enOferta) desc += " en oferta";
    }
    contador.textContent = resultados.length === 0
      ? "Sin resultados"
      : resultados.length === 1
        ? `1 producto encontrado${desc}`
        : `${resultados.length} productos encontrados${desc}`;
  }
}

function limpiarFiltros() {
  $("filtro-precio-min").value = "";
  $("filtro-precio-max").value = "";
  $("filtro-categoria").value  = "";
  $("filtro-marca").value      = "";
  $("filtro-calidad").value    = "";
  $("filtro-orden").value      = "";
  if ($("orden-resultados")) $("orden-resultados").value = "";
  $("buscador").value          = "";
  aplicarFiltros();
}

/* ============================================================
   LISTENERS DEL BUSCADOR Y FILTROS
   Cada cambio en el buscador o en cualquier filtro lateral
   dispara automáticamente aplicarFiltros() para actualizar
   los resultados en tiempo real.
   ============================================================ */
$("btn-buscar").addEventListener("click", aplicarFiltros);                         // botón lupa
$("buscador").addEventListener("keydown", e => { if (e.key === "Enter") aplicarFiltros(); }); // Enter en el buscador
$("buscador").addEventListener("input", aplicarFiltros);                           // mientras escribe
$("filtro-precio-min").addEventListener("input", aplicarFiltros);                  // precio mínimo
$("filtro-precio-max").addEventListener("input", aplicarFiltros);                  // precio máximo
$("filtro-categoria").addEventListener("change", aplicarFiltros);                  // selector categoría
$("filtro-marca").addEventListener("change", aplicarFiltros);                      // selector marca
$("filtro-calidad").addEventListener("change", aplicarFiltros);                    // selector calidad
if ($("filtro-orden")) $("filtro-orden").addEventListener("change", aplicarFiltros); // selector orden

// Selector de orden de la barra de resultados (estilo Mercado Libre)
if ($("orden-resultados")) {
  $("orden-resultados").addEventListener("change", () => {
    if ($("filtro-orden")) $("filtro-orden").value = $("orden-resultados").value;
    aplicarFiltros();
  });
}

// Botón "Ver todos" de la estantería de ofertas
document.addEventListener("click", (e) => {
  if (!e.target.closest("[data-ver-ofertas]")) return;
  limpiarFiltros();
  $("buscador").value = "ofertas";
  aplicarFiltros();
  volverArriba();
});
$("btn-limpiar-filtros").addEventListener("click", limpiarFiltros);                // botón limpiar

// El logo lleva al inicio y limpia todos los filtros y la búsqueda
document.getElementById("logo-home") && document.getElementById("logo-home").addEventListener("click", () => {
  limpiarFiltros();
});

// El botón "Ofertas" busca automáticamente todos los productos en oferta
document.getElementById("nav-ofertas") && document.getElementById("nav-ofertas").addEventListener("click", () => {
  limpiarFiltros();
  $("buscador").value = "ofertas"; // usa el sinónimo "ofertas" del buscador inteligente
  aplicarFiltros();
});

/* ============================================================
   MENÚS DESPLEGABLES DE NAVEGACIÓN
   ============================================================ */

/** Cierra todos los menús desplegables abiertos */
function cerrarMenus(){
  document.querySelectorAll(".menu").forEach(m => m.classList.remove("abierto"));
  document.querySelectorAll(".desplegable > .nav-cat-btn").forEach(b => b.setAttribute("aria-expanded","false"));
}

// Botón "Consolas": filtra por categoría consolas y cierra los menús
$("nav-consolas").addEventListener("click", () => {
  limpiarFiltros();
  $("filtro-categoria").value = "consolas"; // activa el filtro de categoría
  aplicarFiltros();
  cerrarMenus();
});

/** Vuelve al inicio de la página respetando "reducir movimiento". */
function volverArriba(){
  const suave = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  window.scrollTo({ top: 0, behavior: suave ? "smooth" : "auto" });
}

// Botones dentro de los menús desplegables (Controles, Auriculares, Acción, etc.)
// Usan data-filtro-cat="X" para saber qué categoría activar
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filtro-cat]");
  if (!btn) return;
  const cat = btn.dataset.filtrocat || btn.getAttribute("data-filtro-cat");
  limpiarFiltros();
  $("filtro-categoria").value = cat; // establece la categoría seleccionada
  aplicarFiltros();
  cerrarMenus();
  volverArriba(); // los resultados empiezan arriba
});

// Abre/cierra cada menú desplegable al hacer clic en su botón padre
document.querySelectorAll(".desplegable > .nav-cat-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // evita que el clic propague al documento y cierre el menú
    const menu = btn.nextElementSibling;
    const estabaAbierto = menu.classList.contains("abierto");
    cerrarMenus(); // cierra cualquier otro menú abierto
    if(!estabaAbierto){ menu.classList.add("abierto"); btn.setAttribute("aria-expanded","true"); }
  });
});

document.addEventListener("click", cerrarMenus); // clic fuera cierra todos los menús
document.addEventListener("keydown", (e) => { if(e.key === "Escape") cerrarMenus(); }); // Escape también cierra

/* ============================================================
   RECUPERAR CONTRASEÑA
   Flujo en 2 pasos:
   1. Paso 1: el usuario escribe su correo registrado
   2. Paso 2: si existe, puede escribir su nueva contraseña
   La variable correoRecuperar guarda el correo entre los dos pasos.
   ============================================================ */
let correoRecuperar = null; // almacena el correo verificado entre el paso 1 y el paso 2

// Paso 1: verificar que el correo exista en la base de datos
$("form-recuperar").addEventListener("submit", (e) => {
  e.preventDefault();
  const i = $("rec-correo");
  if(!validarCorreo(i)) return; // valida formato del correo
  const cuenta = leerCuentas().find(x => x.correo === i.value.trim().toLowerCase());
  if(!cuenta){
    marcar(i, "No hay una cuenta registrada con ese correo.");
    // Resetear el estado del formulario por si venía de un intento fallido anterior
    $("form-nueva").hidden    = true;
    $("form-recuperar").hidden = false;
    correoRecuperar = null;
    return;
  }
  correoRecuperar = cuenta.correo; // guarda el correo para usarlo en el paso 2
  e.target.hidden = true;           // oculta el formulario de correo
  $("form-nueva").hidden = false;   // muestra el formulario de nueva contraseña
  $("rec-clave").focus();
});

// Paso 2: cambiar la contraseña del usuario verificado
$("form-nueva").addEventListener("submit", (e) => {
  e.preventDefault();
  const a = $("rec-clave"), b = $("rec-clave2");

  // Valida la nueva contraseña y su confirmación
  const okA = validarClave(a);
  const okB = !b.value            ? marcar(b, "Confirma tu contraseña.")
           : b.value !== a.value  ? marcar(b, "Las contraseñas no coinciden.")
           : marcar(b, "");
  if(!okA || !okB) return;

  // Actualiza la contraseña en localStorage
  const cuentas = leerCuentas();
  const cuenta  = cuentas.find(x => x.correo === correoRecuperar);
  cuenta.clave  = a.value;  // guarda la nueva contraseña
  guardarCuentas(cuentas);

  // Limpia y resetea ambos formularios
  e.target.reset();
  e.target.hidden = true;
  $("form-recuperar").hidden = false;
  $("form-recuperar").reset();
  document.querySelectorAll("#vista-recuperar .campo").forEach(c => c.classList.remove("valido","invalido"));
  correoRecuperar = null; // limpia el correo temporal

  // Redirige al login con mensaje de éxito
  $("aviso-registro").textContent = "Tu contraseña fue cambiada. Ya puedes iniciar sesión.";
  $("aviso-registro").hidden = false;
  mostrar("login");
});

/* ============================================================
   AUTO-LOGIN — SESIÓN GUARDADA
   Al cargar la página, si el usuario marcó "Mantener sesión"
   en un acceso anterior, su correo está en localStorage.
   Se busca la cuenta y se entra directamente sin pedir login.
   ============================================================ */
try {
  const guardada = localStorage.getItem("sesion"); // correo guardado de la sesión anterior
  const cuenta   = guardada && leerCuentas().find(x => x.correo === guardada);
  if(cuenta) entrar(cuenta); // entra automáticamente si la cuenta sigue existiendo
} catch(err){} // si localStorage falla, continúa normalmente en la pantalla de inicio

/* ==============================================================================
   SISTEMA DE EVALUACIONES DE PRODUCTOS
   Los usuarios autenticados pueden dejar una calificación (1-5 estrellas) y un
   comentario sobre cualquier producto. Las evaluaciones se almacenan en el
   storage local bajo la estructura:
     { "clave-del-producto": [ {correo, usuario, puntaje, comentario, fecha}, ... ] }
   Donde la clave del producto se genera a partir del nombre del producto
   (convertido a minúsculas y con guiones en lugar de espacios).
   ============================================================================== */
/* ============================================================
   EVALUACIÓN DE PRODUCTOS (pasos 1–11 del caso de uso)
   Permite a los usuarios autenticados dejar una calificación
   (1-5 estrellas) y un comentario sobre un producto.
   Las evaluaciones se guardan en localStorage bajo la clave
   "evaluaciones" como un objeto { claveProducto: [array de evaluaciones] }.
   ============================================================ */

/* --- Leer y guardar evaluaciones en localStorage --- */

/** Lee todas las evaluaciones almacenadas. Retorna {} si no hay ninguna. */
function leerEvaluaciones() {
  try { return JSON.parse(localStorage.getItem("evaluaciones")) || {}; }
  catch(e) { return {}; }
}

/** Guarda el objeto completo de evaluaciones en localStorage. */
function guardarEvaluaciones(data) {
  try { localStorage.setItem("evaluaciones", JSON.stringify(data)); } catch(e) {}
}

/**
 * Genera una clave única para cada producto basada en su nombre.
 * Convierte el nombre a minúsculas y reemplaza espacios por guiones.
 * Ejemplo: "PlayStation 5" → "playstation-5"
 */
function claveProducto(nombre) {
  return nombre.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Retorna el objeto de cuenta del usuario en sesión actualmente,
 * o null si no hay sesión iniciada o si el correo guardado es inválido.
 */
/**
 * Retorna el objeto de cuenta del usuario en sesión actualmente.
 * Primero verifica si existe una sesión activa en el localStorage.
 * Si no está, intenta recuperar el estado de la variable global de respaldo.
 */
function sesionActual() {
  try {
    const correo = localStorage.getItem("sesion");
    if (correo) {
      return leerCuentas().find(x => x.correo === correo.trim()) || null;
    }
  } catch(e) {}
  // Respaldo global si localStorage falla
  return window.__usuarioLogueado || null;
}

/* --- Estrellas HTML --- */
function estrellasHTML(puntaje, total = 5) {
  return Array.from({ length: total }, (_, i) =>
    `<span class="estrella-display ${i < puntaje ? "activa" : ""}" aria-hidden="true">★</span>`
  ).join("");
}

/* --- Calcular promedio de un producto --- */
function calcularPromedio(clave) {
  const evals = leerEvaluaciones()[clave] || [];
  if (!evals.length) return null;
  const suma = evals.reduce((acc, e) => acc + e.puntaje, 0);
  return { promedio: (suma / evals.length).toFixed(1), total: evals.length };
}

/* --- Renderizar lista de evaluaciones en el detalle --- */
function renderEvaluaciones(clave) {
  const evals = (leerEvaluaciones()[clave] || []).slice().reverse(); // más reciente primero
  const lista = $("lista-eval");
  const sinEval = $("sin-eval");

  if (!evals.length) {
    lista.innerHTML = "";
    sinEval.hidden = false;
    return;
  }
  sinEval.hidden = true;
  lista.innerHTML = evals.map(ev => `
    <div class="eval-item">
      <div class="eval-item-cabeza">
        <span class="eval-item-usuario">👤 ${esc(ev.usuario)}</span>
        <span class="eval-item-estrellas">${estrellasHTML(ev.puntaje)}</span>
        <span class="eval-item-fecha">${esc(ev.fecha)}</span>
      </div>
      <p class="eval-item-comentario">${esc(ev.comentario)}</p>
    </div>
  `).join("");
}

/* --- Actualizar el resumen de estrellas en el detalle --- */
function renderResumen(clave) {
  const res = calcularPromedio(clave);
  const wrap = $("detalle-resumen-eval");
  const estrellas = $("resumen-estrellas");
  const texto = $("resumen-texto");

  if (!res) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  estrellas.innerHTML = estrellasHTML(Math.round(res.promedio));
  texto.textContent = `${res.promedio} / 5  (${res.total} opinión${res.total !== 1 ? "es" : ""})`;
}

/**
 * Abre la vista de detalle de un producto seleccionado.
 * Responsabilidades:
 * - Asigna el producto actual a la variable global `productoActual` y registra
 *   la vista (origen) desde la cual se abrió para permitir navegación hacia atrás.
 * - Genera y actualiza la interfaz visual del detalle: imagen, etiquetas de
 *   descuento, categoría, marca, calidad, y precios (con descuento tachado si aplica).
 * - Renderiza dinámicamente las evaluaciones del usuario: resumen de estrellas y
 *   la lista de comentarios recientes.
 * - Gestiona la visibilidad de controles de evaluación y agregado al carrito
 *   según si el usuario está autenticado y/o ya ha evaluado el producto.
 *
 * Flujo de estados posibles:
 *   1) Usuario autenticado y NO ha evaluado → Botón "Evaluar" visible
 *   2) Usuario autenticado y YA evaluó → Mensaje "Ya evaluaste" visible
 *   3) Sin sesión → Aviso de que debe iniciar sesión para evaluar
 */
/* ---- Paso 3: Abrir detalle del producto ---- */
let productoActual = null;
let vistaOrigen    = "principal"; // para saber adónde volver

function abrirDetalle(producto, origen) {
  productoActual = producto;
  vistaOrigen    = origen || "principal";
  const clave    = claveProducto(producto.nombre);

  // Rellenar información
  $("detalle-img").src = producto.imagen;
  $("detalle-img").alt = producto.nombre;
  $("detalle-img").style.display = "block";
  $("detalle-icono").style.display = "none";
  $("detalle-img").onerror = function() {
    this.style.display = "none";
    const ic = $("detalle-icono");
    ic.style.display = "flex";
    ic.style.background = producto.color;
    ic.textContent = producto.emoji;
  };

  if (producto.etiqueta) {
    $("detalle-etiqueta").textContent = producto.etiqueta;
    $("detalle-etiqueta").hidden = false;
  } else {
    $("detalle-etiqueta").hidden = true;
  }

  $("detalle-cat").textContent     = (LABEL_CAT[producto.cat] || producto.cat).toUpperCase();

  // Renderizar descripción del producto
  $("detalle-descripcion").hidden = !producto.descripcion;
  document.querySelector("#detalle-descripcion .descripcion-texto").textContent = producto.descripcion || "";
  $("detalle-nombre").textContent  = producto.nombre;
  $("detalle-marca").textContent   = "🏷️ " + producto.marca;
  $("detalle-calidad").textContent = "⭐ " + producto.calidad;
  $("detalle-precio").innerHTML    = producto.antes
    ? `<s>${moneda(producto.antes)}</s> <strong>${moneda(producto.ahora)}</strong>`
    : `<strong>${moneda(producto.ahora)}</strong>`;

  // Resumen y lista de evaluaciones
  renderResumen(clave);
  renderEvaluaciones(clave);

  // Renderizar especificaciones técnicas
  const specsEl = $("detalle-especificaciones");
  if (specsEl) {
    const specs = producto.especificaciones || ["Garantía de tienda", "Envío disponible", "Producto verificado", "Soporte técnico"];
    specsEl.innerHTML = specs.map(s => `<li>⚡ ${esc(s)}</li>`).join("");
  }

  // Verificar si el usuario ya evaluó este producto (paso 1: debe estar en sesión)
  const usuario = sesionActual();
  const yaEvaluado = usuario && (leerEvaluaciones()[clave] || [])
    .some(ev => ev.correo === usuario.correo);

  $("btn-evaluar").hidden        = yaEvaluado;  // ocultar solo si ya evaluó
  $("ya-evaluado-aviso").hidden  = !yaEvaluado;

  // Sin sesión: mostrar aviso en lugar del botón
  const avisoSesionEval = $("aviso-sesion-eval");
  if (avisoSesionEval) {
    avisoSesionEval.hidden = !!usuario; // visible solo si NO hay sesión
  }
  if (!usuario) $("btn-evaluar").hidden = true;

  mostrar("detalle");
  document.title = `EcoMerce - ${producto.nombre}`;
  actualizarBtnAgregarDetalle(); // mostrar cantidad actual en el botón
}

/* Hacer las tarjetas clicables (delegar en contenedor) */
function activarTarjetas(contenedor, origen) {
  if (!contenedor || contenedor.__tarjetasListo) return; // evita listeners duplicados
  contenedor.__tarjetasListo = true;
  contenedor.addEventListener("click", (e) => {
    const art = e.target.closest(".producto");
    if (!art) return;
    // Si el clic fue en el botón carrito, no abrir detalle
    if (e.target.closest(".btn-carrito-tarjeta")) return;
    const nombre = art.querySelector("h4")?.textContent;
    if (!nombre) return;
    const prod = todosLosProductos().find(p => p.nombre === nombre);
    if (!prod) return;
    // Sin sesión: avisar y redirigir a login
    if (!sesionActual()) {
      mostrarAvisoLogin("Inicia sesión para ver el detalle del producto.");
      return;
    }
    abrirDetalle(prod, origen);
  });
}

/* Botón volver en el detalle: conserva la búsqueda y el scroll anteriores */
$("btn-volver-detalle").addEventListener("click", () => {
  if (historialVistas.length) irAtras();
  else mostrar(vistaOrigen, { reiniciar: true });
});

/* Enlace login desde aviso de evaluación sin sesión */
$("link-login-eval").addEventListener("click", (e) => {
  e.preventDefault();
  mostrar("login");
});

/* ============================================================
   MODAL DE EVALUACIÓN — PASOS 4 AL 11
   ============================================================ */

// Variables de estado del formulario de evaluación
let puntajeSeleccionado = 0; // calificación elegida (1-5), 0 = ninguna
let revisado = false;         // true después de hacer clic en "Revisar"

/**
 * Abre el modal de evaluación y resetea todos sus campos
 * para que el usuario empiece desde cero cada vez.
 */
function abrirModalEval() {
  puntajeSeleccionado = 0;                    // reinicia la calificación
  revisado = false;                           // requiere revisar antes de confirmar
  $("eval-comentario").value = "";            // limpia el textarea
  $("eval-chars").textContent = "0";          // resetea el contador de caracteres
  $("eval-preview").hidden = true;            // oculta la vista previa
  $("btn-eval-confirmar").disabled = true;    // deshabilita confirmar hasta revisar
  $("eval-error-estrellas").hidden = true;    // oculta errores previos
  $("eval-error-comentario").hidden = true;
  // Quita el estado visual de las estrellas seleccionadas
  document.querySelectorAll(".estrella").forEach(btn => btn.classList.remove("seleccionada", "hover"));
  $("modal-eval-nombre").textContent = productoActual?.nombre || ""; // muestra el nombre del producto
  $("modal-evaluacion").hidden = false;       // muestra el modal
  document.body.classList.add("modal-abierto"); // bloquea el scroll del fondo
  document.querySelector("#modal-evaluacion .modal-caja")?.focus(); // foco para accesibilidad
}

// Paso 4: abre el modal cuando el usuario hace clic en "Evaluar producto"
$("btn-evaluar").addEventListener("click", abrirModalEval);

/* Paso 5: el formulario ya está visible al abrir el modal */

/* ---- Paso 6: Estrellas de calificación ----
   Cada estrella tiene un botón con data-val="1" a "5".
   Al hacer clic se selecciona esa calificación.
   Al pasar el mouse (hover) se iluminan las estrellas hasta esa posición. */
const estrellasBtns = document.querySelectorAll(".estrella");

estrellasBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    puntajeSeleccionado = parseInt(btn.dataset.val);
    actualizarEstrellas(puntajeSeleccionado);
    $("eval-error-estrellas").hidden = true;
    revisado = false;
    $("eval-preview").hidden = true;
    $("btn-eval-confirmar").disabled = true;
  });
  btn.addEventListener("mouseenter", () => resaltarEstrellas(parseInt(btn.dataset.val)));
  btn.addEventListener("mouseleave", () => actualizarEstrellas(puntajeSeleccionado));
  btn.addEventListener("focus",      () => resaltarEstrellas(parseInt(btn.dataset.val)));
  btn.addEventListener("blur",       () => actualizarEstrellas(puntajeSeleccionado));
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); btn.click(); }
  });
});

function resaltarEstrellas(hasta) {
  estrellasBtns.forEach(b => b.classList.toggle("hover", parseInt(b.dataset.val) <= hasta));
}
function actualizarEstrellas(hasta) {
  estrellasBtns.forEach(b => {
    b.classList.remove("hover");
    b.classList.toggle("seleccionada", parseInt(b.dataset.val) <= hasta);
  });
}

/* --- Paso 7: Comentario con contador --- */
$("eval-comentario").addEventListener("input", () => {
  const len = $("eval-comentario").value.length;
  $("eval-chars").textContent = len;
  if (len > 0) $("eval-error-comentario").hidden = true;
  revisado = false;
  $("eval-preview").hidden = true;
  $("btn-eval-confirmar").disabled = true;
});

/* --- Paso 8: Revisar evaluación antes de enviar --- */
$("btn-eval-revisar").addEventListener("click", () => {
  let valido = true;

  if (!puntajeSeleccionado) {
    $("eval-error-estrellas").hidden = false;
    valido = false;
  }
  if (!$("eval-comentario").value.trim()) {
    $("eval-error-comentario").hidden = false;
    valido = false;
  }
  if (!valido) return;

  const labels = ["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"];
  $("eval-preview-contenido").innerHTML = `
    <div class="eval-prev-fila">
      <span>Calificación:</span>
      <span>${estrellasHTML(puntajeSeleccionado)} <em>${esc(labels[puntajeSeleccionado])}</em></span>
    </div>
    <div class="eval-prev-fila">
      <span>Comentario:</span>
      <span>${esc($("eval-comentario").value.trim())}</span>
    </div>
  `;
  $("eval-preview").hidden = false;
  revisado = true;
  $("btn-eval-confirmar").disabled = false;
  $("btn-eval-confirmar").focus();
});

/* --- Paso 9 + 10: Confirmar y registrar la evaluación --- */
$("btn-eval-confirmar").addEventListener("click", () => {
  if (!revisado || !puntajeSeleccionado) return;

  const usuario = sesionActual();
  if (!usuario) return;

  const clave      = claveProducto(productoActual.nombre);
  const evals      = leerEvaluaciones();
  evals[clave]     = evals[clave] || [];

  // Paso 10: el sistema registra la evaluación
  const hoy = new Date().toLocaleDateString("es-CO", { year:"numeric", month:"short", day:"numeric" });
  evals[clave].push({
    correo:     usuario.correo,
    usuario:    usuario.nombre.split(" ")[0],
    puntaje:    puntajeSeleccionado,
    comentario: $("eval-comentario").value.trim(),
    fecha:      hoy
  });
  guardarEvaluaciones(evals);

  // Cerrar modal de formulario
  cerrarModalEval();

  // Actualizar vista del detalle
  renderResumen(clave);
  renderEvaluaciones(clave);
  $("btn-evaluar").hidden       = true;
  $("ya-evaluado-aviso").hidden = false;

  // Paso 11: mostrar confirmación
  $("modal-confirmacion").hidden = false;
  document.body.classList.add("modal-abierto");
  $("btn-conf-cerrar").focus();
});

/* --- Cerrar modales --- */
function cerrarModalEval() {
  $("modal-evaluacion").hidden = true;
  document.body.classList.remove("modal-abierto");
}
function cerrarModalConf() {
  $("modal-confirmacion").hidden = true;
  document.body.classList.remove("modal-abierto");
}

$("modal-eval-cerrar").addEventListener("click", cerrarModalEval);
$("btn-conf-cerrar").addEventListener("click",   cerrarModalConf);

// Cerrar al hacer clic fuera del cuadro
$("modal-evaluacion").addEventListener("click", (e) => {
  if (e.target === $("modal-evaluacion")) cerrarModalEval();
});
$("modal-confirmacion").addEventListener("click", (e) => {
  if (e.target === $("modal-confirmacion")) cerrarModalConf();
});

// Cerrar con Escape — un único listener centralizado para todos los modales
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("modal-evaluacion").hidden)   cerrarModalEval();
  if (!$("modal-confirmacion").hidden) cerrarModalConf();
  if (!$("modal-checkout").hidden)     cerrarCheckout();
  if (!$("modal-compra-ok").hidden) {
    $("modal-compra-ok").hidden = true;
    document.body.classList.remove("modal-abierto");
  }
  if (!$("modal-seguimiento").hidden)  cerrarSeguimiento();
});

/* --- Activar tarjetas clicables: se llaman desde entrar() --- */

/* ============================================================
   CARRITO DE COMPRAS
   El carrito se guarda en localStorage bajo la clave "carrito"
   como un array de objetos: { nombre, imagen, emoji, color, ahora, cantidad }
   Solo se guardan los datos necesarios para mostrar el carrito,
   no el objeto completo del producto.
   ============================================================ */

/**
 * Lee el carrito de localStorage y valida que cada item tenga
 * la estructura correcta. Descarta items corruptos o manipulados.
 */
function leerCarrito() {
  try {
    const items = JSON.parse(localStorage.getItem("carrito")) || [];
    // Solo retorna items con nombre válido, precio positivo y cantidad positiva
    return items.filter(i =>
      i && typeof i.nombre === "string" && i.nombre.trim() &&
      typeof i.ahora === "number" && i.ahora > 0 &&
      typeof i.cantidad === "number" && i.cantidad > 0
    );
  }
  catch(e) { return []; }
}

/**
 * Guarda el carrito en localStorage y actualiza el badge del header.
 * @param {Array} items - Array de items del carrito
 */
function guardarCarrito(items) {
  try { localStorage.setItem("carrito", JSON.stringify(items)); } catch(e) {}
  actualizarBadge(); // actualiza el número en el ícono del carrito
}

/**
 * Actualiza el badge numérico sobre el ícono del carrito en el header.
 * Muestra la cantidad total de unidades (no de productos únicos).
 * Si el carrito está vacío, oculta el badge.
 */
function actualizarBadge() {
  const items = leerCarrito();
  const total = items.reduce((s, i) => s + i.cantidad, 0); // suma todas las cantidades
  const badge = $("carrito-badge");
  if (!badge) return;
  const anterior = parseInt(badge.textContent) || 0;
  badge.textContent = total;
  badge.hidden      = total === 0; // ocultar si no hay productos
  // Microinteracción: el badge "late" cuando aumenta la cantidad
  if (total > anterior) {
    badge.classList.remove("pop");
    void badge.offsetWidth;
    badge.classList.add("pop");
  }
}

/* --- Agregar producto al carrito --- */
function agregarAlCarrito(producto) {
  const items = leerCarrito();
  const idx   = items.findIndex(i => i.nombre === producto.nombre);
  if (idx >= 0) {
    items[idx].cantidad += 1;
  } else {
    items.push({
      nombre:  producto.nombre,
      imagen:  producto.imagen,
      emoji:   producto.emoji,
      color:   producto.color,
      ahora:   producto.ahora,
      cantidad: 1
    });
  }
  guardarCarrito(items);
  mostrarToastCarrito(producto.nombre);

  // Microinteracción: pulso del botón del carrito en el header
  const btnCarrito = $("btn-abrir-carrito");
  if (btnCarrito) {
    btnCarrito.classList.remove("carrito-pulso");
    void btnCarrito.offsetWidth;
    btnCarrito.classList.add("carrito-pulso");
    setTimeout(() => btnCarrito.classList.remove("carrito-pulso"), 600);
  }
}

/* Aviso de login requerido — toast con botón de acción */
function mostrarAvisoLogin(msg) {
  let toast = document.getElementById("toast-login");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-login";
    toast.className = "toast-login";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${esc(msg)}</span>
    <button id="toast-login-btn" type="button">Iniciar sesión</button>`;
  toast.classList.add("visible");
  clearTimeout(toast._timer);
  document.getElementById("toast-login-btn").addEventListener("click", () => {
    toast.classList.remove("visible");
    mostrar("login");
  });
  toast._timer = setTimeout(() => toast.classList.remove("visible"), 4000);
}

/* Toast genérico reutilizable (carrito, avisos, etc.) */
function mostrarToast(mensaje, duracion = 2500) {
  let toast = document.getElementById("toast-carrito");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-carrito";
    toast.className = "toast-carrito";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = mensaje;
  toast.classList.remove("visible");
  void toast.offsetWidth;              // reinicia la animación de entrada
  toast.classList.add("visible");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("visible"), duracion);
}

/* Toast aviso sesión no persistida */
function mostrarToastSesion() {
  let toast = document.getElementById("toast-sesion");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-sesion";
    toast.className = "toast-carrito"; // reutiliza el mismo estilo
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = "⚠ Tu sesión no se guardará al cerrar el navegador.";
  toast.classList.add("visible");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("visible"), 4000);
}

/* Toast de confirmación al agregar */
function mostrarToastCarrito(nombre) {
  mostrarToast(`✔ "${nombre}" agregado al carrito`);
}

/* --- Botón carrito en la barra nav --- */
$("btn-abrir-carrito").addEventListener("click", () => {
  renderCarrito();
  mostrar("carrito");
});

/* --- Botón "Agregar al carrito" en vista detalle --- */
$("btn-agregar-detalle").addEventListener("click", () => {
  if (!sesionActual()) {
    mostrarAvisoLogin("Inicia sesión para agregar productos al carrito.");
    return;
  }
  if (productoActual) {
    agregarAlCarrito(productoActual);
    actualizarBtnAgregarDetalle();
    // Microinteracción: confirmación visual en el botón
    const btn = $("btn-agregar-detalle");
    btn.classList.remove("btn-agregado");
    void btn.offsetWidth;
    btn.classList.add("btn-agregado");
    setTimeout(() => btn.classList.remove("btn-agregado"), 650);
  }
});

function actualizarBtnAgregarDetalle() {
  if (!productoActual) return;
  const items = leerCarrito();
  const item  = items.find(i => i.nombre === productoActual.nombre);
  const btn   = $("btn-agregar-detalle");
  if (item && item.cantidad > 0) {
    btn.textContent = `🛒 En carrito: ${item.cantidad}`;
  } else {
    btn.textContent = "🛒 Agregar al carrito";
  }
}

/* --- Botón "Agregar al carrito" en tarjetas (delegación) --- */
function activarBotonesCarritoEnGrilla(contenedor) {
  if (!contenedor || contenedor.__carritoListo) return; // evita listeners duplicados
  contenedor.__carritoListo = true;
  contenedor.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-carrito-tarjeta");
    if (!btn) return;
    e.stopPropagation(); // no abrir detalle
    if (!sesionActual()) {
      mostrarAvisoLogin("Inicia sesión para agregar productos al carrito.");
      return;
    }
    const nombre = btn.dataset.nombre;
    const prod   = todosLosProductos().find(p => p.nombre === nombre);
    if (prod) agregarAlCarrito(prod);
  });
}

/* Activar todas las grillas (catálogo agrupado y resultados) */
function reactivarGrillas() {
  document.querySelectorAll(".grilla").forEach(grilla => {
    activarTarjetas(grilla, "principal");
    activarBotonesCarritoEnGrilla(grilla);
    animarAparicion(grilla);
  });
}

/**
 * Renderiza la lista de productos en el carrito de compras dentro de la vista correspondiente.
 * - Si el carrito está vacío, muestra el estado vacío y oculta el contenido.
 * - Si hay productos, genera cards con controles de cantidad (+/-) para cada item.
 * - Calcula dinámicamente el subtotal y el total general del carrito.
 * - Delega eventos de interacción (incrementar, decrementar, eliminar)
 *   a los elementos generados dinámicamente.
 */
function renderCarrito() {
  const items         = leerCarrito();
  const vacio         = $("carrito-vacio");
  const contenido     = $("carrito-contenido");
  const itemsEl       = $("carrito-items");
  const subtotalEl    = $("carrito-subtotal");
  const totalEl       = $("carrito-total");

  if (!items.length) {
    vacio.hidden    = false;
    contenido.hidden = true;
    return;
  }
  vacio.hidden    = true;
  contenido.hidden = false;

  itemsEl.innerHTML = items.map((item, idx) => `
    <div class="carrito-item">
      <img class="carrito-item-img" src="${esc(item.imagen)}" alt="${esc(item.nombre)}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="carrito-item-icono" style="display:none;background:${esc(item.color)}">${esc(item.emoji)}</div>
      <div class="carrito-item-info">
        <p class="carrito-item-nombre">${esc(item.nombre)}</p>
        <p class="carrito-item-precio">${moneda(item.ahora)}</p>
      </div>
      <div class="carrito-item-cantidad">
        <button class="cant-btn" data-idx="${idx}" data-op="menos" aria-label="Quitar uno">−</button>
        <span class="cant-num">${item.cantidad}</span>
        <button class="cant-btn" data-idx="${idx}" data-op="mas" aria-label="Agregar uno">+</button>
      </div>
      <p class="carrito-item-subtotal">${moneda(item.ahora * item.cantidad)}</p>
      <button class="carrito-item-eliminar" data-idx="${idx}" aria-label="Eliminar producto">🗑</button>
    </div>
  `).join("");

  const subtotal = items.reduce((s, i) => s + i.ahora * i.cantidad, 0);
  subtotalEl.textContent = moneda(subtotal);
  totalEl.textContent    = moneda(subtotal);

  /* Eventos de cantidad y eliminar */
  itemsEl.querySelectorAll(".cant-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const items2 = leerCarrito();
      const idx2   = parseInt(btn.dataset.idx);
      if (btn.dataset.op === "mas") {
        items2[idx2].cantidad += 1;
      } else {
        items2[idx2].cantidad -= 1;
        if (items2[idx2].cantidad <= 0) items2.splice(idx2, 1);
      }
      guardarCarrito(items2);
      renderCarrito();
    });
  });
  itemsEl.querySelectorAll(".carrito-item-eliminar").forEach(btn => {
    btn.addEventListener("click", () => {
      const items2 = leerCarrito();
      items2.splice(parseInt(btn.dataset.idx), 1);
      guardarCarrito(items2);
      renderCarrito();
    });
  });
}

/* Volver desde el carrito */
$("btn-volver-carrito").addEventListener("click", () => mostrar("principal", { reiniciar: true }));
$("btn-ir-tienda").addEventListener("click",      () => mostrar("principal", { reiniciar: true }));

/* Vaciar carrito completo */
$("btn-vaciar-carrito").addEventListener("click", () => {
  if (!confirm("¿Vaciar todo el carrito?")) return;
  guardarCarrito([]);
  renderCarrito();
});

/* ---- PASO 3: Realizar compra ---- */
$("btn-realizar-compra").addEventListener("click", () => {
  const usuario = sesionActual();
  if (!usuario) {
    alert("Debes iniciar sesión para realizar una compra.");
    mostrar("login");
    return;
  }
  const items = leerCarrito();
  if (!items.length) {
    mostrarToast("🛒 Tu carrito está vacío.");
    return;
  }
  // Siempre poner el nombre del usuario actual (no el de una sesión anterior)
  $("env-nombre").value = usuario.nombre;
  // Limpiar campos de envío si venían de otra sesión
  ["env-telefono","env-direccion","env-ciudad","env-departamento"].forEach(id => {
    $(id).value = "";
    const wrap = $(id).closest(".campo");
    if (wrap) wrap.classList.remove("valido","invalido");
  });
  const wrap0 = $("env-nombre").closest(".campo");
  if (wrap0) wrap0.classList.remove("invalido"); wrap0 && wrap0.classList.add("valido");
  abrirCheckout(1);
});

/* ============================================================
   CHECKOUT MULTISTEP — 3 PASOS
   Paso 1: Dirección de envío
   Paso 2: Método de pago
   Paso 3: Resumen y confirmación
   ============================================================ */
let datosEnvio  = null;         // objeto con los datos del paso 1 de envío
let metodoPago  = "tarjeta";    // método seleccionado en el paso 2
const COSTO_ENVIO = 15000;      // costo fijo de envío en pesos colombianos

/**
 * Abre el modal de checkout en el paso indicado.
 * @param {number} paso - Número de paso (1, 2 o 3)
 */
function abrirCheckout(paso) {
  irAPasoCheckout(paso);
  $("modal-checkout").hidden = false;
  document.body.classList.add("modal-abierto");
}

/** Cierra el modal de checkout (no permite cerrarlo mientras se procesa el pago) */
function cerrarCheckout() {
  if (compraProcesando) return;
  $("modal-checkout").hidden = true;
  document.body.classList.remove("modal-abierto");
}

/**
 * Muestra la sección del paso indicado y oculta las demás.
 * También actualiza el indicador visual de pasos (1, 2, 3).
 */
function irAPasoCheckout(paso) {
  // Oculta todas las secciones del checkout
  ["checkout-envio", "checkout-pago", "checkout-resumen", "checkout-procesando"]
    .forEach(id => $(id).hidden = true);
  // Muestra solo la sección del paso actual
  const mapa = { 1: "checkout-envio", 2: "checkout-pago", 3: "checkout-resumen" };
  if (mapa[paso]) $(mapa[paso]).hidden = false;
  // Actualiza el estado visual de los indicadores de paso
  document.querySelectorAll(".checkout-paso").forEach(el => {
    const n = parseInt(el.dataset.paso);
    el.classList.toggle("activo",     n === paso);  // paso actual: resaltado
    el.classList.toggle("completado", n < paso);    // pasos anteriores: completados
  });
}

$("checkout-cerrar").addEventListener("click", cerrarCheckout);
$("modal-checkout").addEventListener("click", (e) => {
  if (e.target === $("modal-checkout")) cerrarCheckout();
});

/* ---- PASO 1→2: Validar dirección de envío ---- */
$("form-envio").addEventListener("submit", (e) => {
  e.preventDefault();
  const campos = [
    { id: "env-nombre",      msg: "Escribe tu nombre completo." },
    { id: "env-telefono",    msg: "Escribe tu teléfono.",        re: /^\d{7,15}$/, reMsg: "Teléfono inválido (solo números, 7-15 dígitos)." },
    { id: "env-direccion",   msg: "Escribe tu dirección." },
    { id: "env-ciudad",      msg: "Escribe la ciudad." },
    { id: "env-departamento",msg: "Escribe el departamento." }
  ];

  let valido = true;
  campos.forEach(({ id, msg, re, reMsg }) => {
    const inp  = $(id);
    const wrap = inp.closest(".campo");
    const err  = wrap.querySelector(".msg-error");
    inp.value  = inp.value.trim();
    if (!inp.value) {
      err.textContent = msg;
      wrap.classList.add("invalido");
      wrap.classList.remove("valido");
      valido = false;
    } else if (re && !re.test(inp.value)) {
      err.textContent = reMsg;
      wrap.classList.add("invalido");
      wrap.classList.remove("valido");
      valido = false;
    } else {
      err.textContent = "";
      wrap.classList.remove("invalido");
      wrap.classList.add("valido");
    }
  });

  if (!valido) { e.target.querySelector(".invalido input").focus(); return; }

  datosEnvio = {
    nombre:       $("env-nombre").value,
    telefono:     $("env-telefono").value,
    direccion:    $("env-direccion").value,
    ciudad:       $("env-ciudad").value,
    departamento: $("env-departamento").value
  };
  irAPasoCheckout(2);
});

/* ---- PASO 2: Mostrar/ocultar campos de tarjeta según método ---- */
document.querySelectorAll("input[name='metodo-pago']").forEach(radio => {
  radio.addEventListener("change", () => {
    metodoPago = radio.value;
    $("campos-tarjeta").hidden = metodoPago !== "tarjeta";
  });
});

/* Formato automático número de tarjeta */
$("tarjeta-num").addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "").substring(0, 16);
  e.target.value = v.replace(/(.{4})/g, "$1 ").trim();
});
/* Formato MM/AA */
$("tarjeta-exp").addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "").substring(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
  e.target.value = v;
});

$("pago-volver").addEventListener("click", () => {
  // Quitar estilos de validación al volver para que el usuario pueda editar libremente
  document.querySelectorAll("#form-envio .campo").forEach(c => c.classList.remove("valido","invalido"));
  irAPasoCheckout(1);
});

/* ---- PASO 2→3: Validar pago y armar resumen ---- */
$("pago-continuar").addEventListener("click", () => {
  metodoPago = document.querySelector("input[name='metodo-pago']:checked").value;

  /* Validar campos de tarjeta si aplica */
  if (metodoPago === "tarjeta") {
    const num = $("tarjeta-num").value.replace(/\s/g, "");
    const exp = $("tarjeta-exp").value;
    const cvv = $("tarjeta-cvv").value;

    const camposTarjeta = [
      { inp: $("tarjeta-num"), ok: num.length === 16,          msg: "Número de tarjeta inválido." },
      { inp: $("tarjeta-exp"), ok: /^\d{2}\/\d{2}$/.test(exp), msg: "Formato MM/AA requerido." },
      { inp: $("tarjeta-cvv"), ok: /^\d{3}$/.test(cvv),        msg: "CVV de 3 dígitos requerido." }
    ];
    let valido = true;
    camposTarjeta.forEach(({ inp, ok, msg }) => {
      const wrap = inp.closest(".campo");
      const err  = wrap.querySelector(".msg-error");
      if (!ok) {
        err.textContent = msg;
        wrap.classList.add("invalido");
        wrap.classList.remove("valido");
        valido = false;
      } else {
        err.textContent = "";
        wrap.classList.remove("invalido");
        wrap.classList.add("valido");
      }
    });
    if (!valido) { $("tarjeta-num").focus(); return; }
  }

  armarResumen();   // recalcula siempre con los datos actuales de envío y pago
  irAPasoCheckout(3);
});

$("resumen-volver").addEventListener("click", () => {
  irAPasoCheckout(2);
  // Al volver y luego avanzar de nuevo, armarResumen se llama en pago-continuar
});

/* ---- PASO 3: Armar resumen ---- */
const LABEL_PAGO = {
  tarjeta: "💳 Tarjeta crédito / débito",
  nequi:   "📱 Nequi",
  pse:     "🏦 PSE",
  contraentrega: "🏠 Pago contraentrega"
};

function armarResumen() {
  const items    = leerCarrito();
  const subtotal = items.reduce((s, i) => s + i.ahora * i.cantidad, 0);
  const total    = subtotal + COSTO_ENVIO;

  $("resumen-productos").innerHTML = items.map(item => `
    <div class="resumen-linea-prod">
      <span>${esc(item.nombre)} × ${item.cantidad}</span>
      <span>${moneda(item.ahora * item.cantidad)}</span>
    </div>
  `).join("");

  $("resumen-direccion").innerHTML =
    `${esc(datosEnvio.nombre)}<br>${esc(datosEnvio.direccion)}<br>${esc(datosEnvio.ciudad)}, ${esc(datosEnvio.departamento)}<br>📞 ${esc(datosEnvio.telefono)}`;

  $("resumen-pago").textContent = LABEL_PAGO[metodoPago] || metodoPago;
  $("res-subtotal").textContent = moneda(subtotal);
  $("res-envio").textContent    = moneda(COSTO_ENVIO);
  $("res-total").textContent    = moneda(total);
}

/* ---- PASOS 10-13: Confirmar compra ---- */
let compraProcesando = false;

$("btn-confirmar-compra").addEventListener("click", () => {
  if (compraProcesando) return;
  // Verificar que la sesión siga activa
  if (!sesionActual()) {
    cerrarCheckout();
    mostrarAvisoLogin("Tu sesión expiró. Inicia sesión para completar la compra.");
    return;
  }
  compraProcesando = true;
  $("btn-confirmar-compra").disabled = true;
  /* Paso 11: procesar pago (simulado) */
  $("checkout-resumen").hidden   = true;
  $("checkout-procesando").hidden = false;

  setTimeout(() => {
    /* Paso 12: registrar pedido */
    const items    = leerCarrito();
    const subtotal = items.reduce((s, i) => s + i.ahora * i.cantidad, 0);
    const pedido   = {
      id:       "PED-" + Date.now(),
      fecha:    new Date().toLocaleDateString("es-CO", { year:"numeric", month:"short", day:"numeric" }),
      items,
      envio:    datosEnvio,
      pago:     metodoPago,
      subtotal,
      costoEnvio: COSTO_ENVIO,
      total:    subtotal + COSTO_ENVIO,
      usuario:  sesionActual()?.correo || "anonimo"
    };

    try {
      const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
      pedidos.push(pedido);
      localStorage.setItem("pedidos", JSON.stringify(pedidos));
    } catch(err) {}

    /* Vaciar carrito */
    guardarCarrito([]);

    /* Cerrar checkout */
    cerrarCheckout();

    /* Paso 13: mostrar confirmación */
    $("compra-ok-numero").textContent = "Número de pedido: " + pedido.id;
    $("compra-ok-msg").textContent    =
      `Recibirás tu pedido en ${datosEnvio.ciudad}. ¡Gracias por tu compra!`;
    $("modal-compra-ok").hidden = false;
    document.body.classList.add("modal-abierto");
    $("btn-compra-ok-cerrar").focus();

    /* Resetear formularios */
    $("form-envio").reset();
    $("form-envio").querySelectorAll(".campo").forEach(c => c.classList.remove("valido","invalido"));
    document.querySelectorAll(".campos-tarjeta .campo").forEach(c => c.classList.remove("valido","invalido"));
    datosEnvio = null;
    metodoPago = "tarjeta";
    compraProcesando = false;
    $("btn-confirmar-compra").disabled = false;
    $("campos-tarjeta").hidden = false;
    document.querySelector("input[name='metodo-pago'][value='tarjeta']").checked = true;

  }, 1800); /* Simulación de procesamiento */
});

/* Cerrar confirmación de compra */
$("btn-compra-ok-cerrar").addEventListener("click", () => {
  $("modal-compra-ok").hidden = true;
  document.body.classList.remove("modal-abierto");
  renderPedidos();
  mostrar("pedidos");
});
$("modal-compra-ok").addEventListener("click", (e) => {
  if (e.target === $("modal-compra-ok")) {
    $("modal-compra-ok").hidden = true;
    document.body.classList.remove("modal-abierto");
    renderPedidos();
    mostrar("pedidos");
  }
});

/* Escape centralizado arriba — no duplicar aquí */

/* Activar grillas con botones de carrito al entrar */
reactivarGrillas();
actualizarBadge(); // inicializar badge desde localStorage al cargar

/* ============================================================
   SEGUIMIENTO DE PEDIDOS (pasos 1–7)
   ============================================================ */

/* ============================================================
   SEGUIMIENTO DE PEDIDOS (pasos 1–7)
   Simula el ciclo de vida de un pedido:
   - Día 0:   Alistando productos
   - Día 1-3: Pedido enviado (en camino)
   - Día 3+:  Entregado
   La transportadora y guía se generan de forma determinista
   usando los últimos dígitos del ID del pedido como semilla.
   ============================================================ */

// Lista de transportadoras disponibles para asignar a los pedidos
const TRANSPORTADORAS = ["Servientrega", "Coordinadora", "Envia", "TCC", "Deprisa"];

/**
 * Genera los datos de envío simulados para un pedido.
 * Usa los últimos 6 dígitos del timestamp del ID como semilla
 * para que los datos sean siempre los mismos para el mismo pedido.
 * @param {string} pedidoId - ID del pedido (formato "PED-1234567890")
 * @returns {{ transportadora, guia, fechaEstStr, dias }}
 */
function generarDatosEnvio(pedidoId) {
  const seed           = pedidoId.replace(/\D/g, "").slice(-6); // últimos 6 dígitos numéricos
  const idx            = parseInt(seed) % TRANSPORTADORAS.length; // índice determinista
  const transportadora = TRANSPORTADORAS[idx];
  const guia           = transportadora.slice(0, 3).toUpperCase() + seed; // Ej: "SER123456"

  // Fecha estimada: entre 3 y 7 días desde hoy (determinista por semilla)
  const dias        = 3 + (parseInt(seed.slice(-1)) % 5); // entre 3 y 7 días
  const fechaEst    = new Date();
  fechaEst.setDate(fechaEst.getDate() + dias);
  const fechaEstStr = fechaEst.toLocaleDateString("es-CO", { weekday:"long", year:"numeric", month:"long", day:"numeric" });

  return { transportadora, guia, fechaEstStr, dias };
}

// Definición de los estados posibles del pedido
const ESTADOS = [
  { key: "alistando",  label: "Alistando productos",    emoji: "📦", desc: "Estamos preparando tu pedido." },
  { key: "enviado",    label: "Pedido enviado",          emoji: "🚚", desc: "Tu pedido está en camino." },
  { key: "entregado",  label: "Entregado",               emoji: "✅", desc: "Tu pedido fue entregado exitosamente." }
];

/**
 * Calcula el estado actual del pedido según los días transcurridos
 * desde que se creó (usando el timestamp del ID).
 *
 * Estados simulados basados en el tiempo:
 * - < 1 día : "alistando" — El pedido se está preparando
 * - 1-3 días: "enviado"   — El pedido está en tránsito
 * - >= 3 días: "entregado" — El pedido llegó al destino
 *
 * @param {Object} pedido - Objeto pedido con un ID que contiene un timestamp (PED-{timestamp})
 * @returns {string} Clave del estado actual ('alistando', 'enviado' o 'entregado')
 */
function estadoPedido(pedido) {
  const ahora  = Date.now();
  const creado = parseInt(pedido.id.replace("PED-", "")); // timestamp de creación
  const dias   = (ahora - creado) / (1000 * 60 * 60 * 24); // convierte ms a días

  if (dias < 1)  return "alistando";
  if (dias < 3)  return "enviado";
  return "entregado";
}

/* ---- Persistencia: enriquecer pedido con datos de envío al guardarlo ---- */
/* Reemplazamos guardarPedido para inyectar guía/transportadora */
function enriquecerPedido(pedido) {
  if (!pedido.envioGenerado) {
    const datos = generarDatosEnvio(pedido.id);
    pedido.transportadora = datos.transportadora;
    pedido.guia           = datos.guia;
    pedido.fechaEstimada  = datos.fechaEstStr;
    pedido.diasEstimados  = datos.dias;
    pedido.envioGenerado  = true;
  }
  return pedido;
}

/* ---- VISTA: Mis pedidos ---- */
function leerPedidosUsuario() {
  const usuario = sesionActual();
  if (!usuario) return [];
  try {
    const todos = JSON.parse(localStorage.getItem("pedidos")) || [];
    return todos
      .filter(p => p.usuario === usuario.correo)
      .map(enriquecerPedido)
      .reverse(); // más reciente primero
  } catch(e) { return []; }
}

function guardarPedidosEnriquecidos(pedidos) {
  try {
    const todos  = JSON.parse(localStorage.getItem("pedidos")) || [];
    const correo = sesionActual()?.correo;
    const otros  = todos.filter(p => p.usuario !== correo);
    localStorage.setItem("pedidos", JSON.stringify([...otros, ...pedidos.slice().reverse()]));
  } catch(e) {}
}

const LABEL_PAGO_SEG = {
  tarjeta: "💳 Tarjeta", nequi: "📱 Nequi",
  pse: "🏦 PSE", contraentrega: "🏠 Contraentrega"
};

function renderPedidos() {
  const pedidos   = leerPedidosUsuario();
  const listaEl   = $("pedidos-lista");
  const vacioEl   = $("pedidos-vacio");

  /* Guardar enriquecidos */
  if (pedidos.length) guardarPedidosEnriquecidos(pedidos);

  if (!pedidos.length) {
    vacioEl.hidden  = false;
    listaEl.innerHTML = "";
    return;
  }
  vacioEl.hidden = true;

  listaEl.innerHTML = pedidos.map(p => {
    const estado    = estadoPedido(p);
    const estadoObj = ESTADOS.find(e => e.key === estado) || ESTADOS[0];
    const total     = p.total || (p.subtotal + p.costoEnvio);
    const items     = p.items || [];
    const resumen   = items.slice(0, 2).map(i => i.nombre).join(", ") +
                      (items.length > 2 ? ` y ${items.length - 2} más` : "");
    return `
      <div class="pedido-card" data-id="${esc(p.id)}">
        <div class="pedido-card-cabeza">
          <div>
            <p class="pedido-card-id">${esc(p.id)}</p>
            <p class="pedido-card-fecha">${esc(p.fecha)}</p>
          </div>
          <span class="pedido-estado estado-${esc(estado)}">${esc(estadoObj.emoji)} ${esc(estadoObj.label)}</span>
        </div>
        <p class="pedido-card-resumen">${esc(resumen)}</p>
        <div class="pedido-card-pie">
          <span class="pedido-card-total">${moneda(total)}</span>
          <button class="btn-ver-pedido" data-id="${esc(p.id)}" type="button">Ver detalle →</button>
        </div>
      </div>`;
  }).join("");

  listaEl.querySelectorAll(".btn-ver-pedido").forEach(btn => {
    btn.addEventListener("click", () => abrirSeguimiento(btn.dataset.id));
  });
}

/* ---- MODAL: Seguimiento del pedido (pasos 1-7) ---- */
function abrirSeguimiento(pedidoId) {
  const pedidos = leerPedidosUsuario();
  const pedido  = pedidos.find(p => p.id === pedidoId);
  if (!pedido) return;

  const estado    = estadoPedido(pedido);
  const estadoIdx = ESTADOS.findIndex(e => e.key === estado);
  const total     = pedido.total || (pedido.subtotal + pedido.costoEnvio);

  /* Número de pedido */
  $("seg-numero").textContent = pedido.id;

  /* Paso 6: Guía y transportadora */
  $("seg-transportadora").textContent  = pedido.transportadora;
  $("seg-guia").textContent            = pedido.guia;
  $("seg-fecha-entrega").textContent   = pedido.fechaEstimada;          /* Paso 7 */
  $("seg-metodo-pago").textContent     = LABEL_PAGO_SEG[pedido.pago] || pedido.pago;

  /* Pasos 1-3: Línea de tiempo */
  $("seg-timeline").innerHTML = ESTADOS.map((e, i) => `
    <div class="seg-step ${i <= estadoIdx ? "completado" : ""} ${i === estadoIdx ? "activo" : ""}">
      <div class="seg-step-dot">${i <= estadoIdx ? esc(e.emoji) : ""}</div>
      ${i < ESTADOS.length - 1 ? '<div class="seg-step-linea"></div>' : ""}
      <div class="seg-step-info">
        <p class="seg-step-label">${esc(e.label)}</p>
        <p class="seg-step-desc">${i === estadoIdx ? esc(e.desc) : ""}</p>
      </div>
    </div>
  `).join("");

  /* Pasos 4-5: Notificación si ya fue enviado */
  const notifEl = $("seg-notificacion");
  if (estado === "enviado" || estado === "entregado") {
    $("seg-notif-msg").textContent = estado === "enviado"
      ? `Tu pedido fue enviado con ${pedido.transportadora}. Guía: ${pedido.guia}. Llega el ${pedido.fechaEstimada}.`
      : `Tu pedido fue entregado. ¡Gracias por comprar en EcoMerce!`;
    notifEl.hidden = false;
  } else {
    notifEl.hidden = true;
  }

  /* Productos */
  $("seg-productos").innerHTML = (pedido.items || []).map(item => `
    <div class="resumen-linea-prod">
      <span>${esc(item.nombre)} × ${esc(String(item.cantidad))}</span>
      <span>${moneda(item.ahora * item.cantidad)}</span>
    </div>
  `).join("");

  /* Totales */
  $("seg-totales").innerHTML = `
    <div class="carrito-resumen-fila"><span>Subtotal</span><span>${moneda(pedido.subtotal)}</span></div>
    <div class="carrito-resumen-fila"><span>Envío</span><span>${moneda(pedido.costoEnvio)}</span></div>
    <div class="carrito-resumen-fila carrito-total"><span>Total</span><span>${moneda(total)}</span></div>
  `;

  $("modal-seguimiento").hidden = false;
  document.body.classList.add("modal-abierto");
}

function cerrarSeguimiento() {
  $("modal-seguimiento").hidden = true;
  document.body.classList.remove("modal-abierto");
}

$("seg-cerrar").addEventListener("click",   cerrarSeguimiento);
$("seg-btn-ok").addEventListener("click",   cerrarSeguimiento);
$("modal-seguimiento").addEventListener("click", (e) => {
  if (e.target === $("modal-seguimiento")) cerrarSeguimiento();
});
/* Escape centralizado arriba — no duplicar aquí */

/* Botones de navegación en vista pedidos */
$("btn-volver-pedidos").addEventListener("click",    () => mostrar("principal", { reiniciar: true }));
$("btn-pedidos-ir-tienda").addEventListener("click", () => mostrar("principal", { reiniciar: true }));
/* ============================================================
   MICROINTERACCI�N: ONDA (RIPPLE) AL PULSAR BOTONES
   Crea un c�rculo que nace en el punto donde se hizo clic y se
   expande hasta desvanecerse. Se desactiva si el usuario pidi�
   reducir el movimiento.
   ============================================================ */
document.addEventListener("pointerdown", (e) => {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const el = e.target.closest(
    ".btn, .btn-carrito-tarjeta, .btn-carrito-detalle, .btn-ver-pedido, " +
    ".btn-limpiar, .btn-volver, .btn-vaciar-carrito, .cant-btn, .nav-cat-btn, " +
    ".buscador-btn, .btn-atras-global"
  );
  if (!el || el.disabled) return;

  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const size = Math.max(rect.width, rect.height) * 1.6;
  const onda = document.createElement("span");
  onda.className = "ripple";
  onda.style.width  = size + "px";
  onda.style.height = size + "px";
  onda.style.left   = (e.clientX - rect.left - size / 2) + "px";
  onda.style.top    = (e.clientY - rect.top  - size / 2) + "px";

  el.appendChild(onda);
  onda.addEventListener("animationend", () => onda.remove(), { once: true });
});

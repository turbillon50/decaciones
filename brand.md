# Decaciones — Módulo de Marca (VForge · Paso 0)

> Identidad real extraída del **logo + assets + código**. Esta marca **MANDA**
> sobre cualquier estética de método. VForge aporta calidad y animación, **no**
> colores propios.

## Identidad

- **Producto:** PWA de música organizada por décadas (rockola / Cover Flow).
- **Alma / tono visual:** *iPod Classic + rockola + hi-fi analógico vintage*,
  premium y cálido. Vinilo, cobre viejo, marfil. Nostalgia tangible.
- **Personalidad:** táctil, cálida, nocturna, de lujo discreto. Refinado, nunca
  estridente ni corporativo.

## Logo

- **Ubicación:** `public/icons/decaciones-icon.svg` (principal),
  `public/icons/maskable-icon.svg` (maskable PWA).
- **Construcción:** tornamesa + cassette + aguja/VU + letra **“D”** en oro cálido,
  sobre cuadro negro redondeado (rx 92).
- **Apoyo:** `decaciones-hero.svg`, carátulas `album-{gold,amber,teal,rose}.svg`,
  `vu-meters.svg`.
- **Estado:** ✅ presente y coherente en todos los assets.

## Paleta canónica — “Vinilo & Cobre” (activa en `globals.css`)

Evolución refinada de la paleta del logo (oro/teal cálidos) hacia cobre + marfil.

### Modo oscuro (default)
| Token | Hex | Rol |
|---|---|---|
| `--background` | `#0e0b09` | Negro cálido (fondo base) |
| `--surface` | `#17110d` | Tarjetas |
| `--surface-2` | `#1d1610` | Superficie 2 |
| `--surface-3` | `#2a2118` | Superficie elevada |
| `--line` | `#38291d` | Bordes marrón cálido |
| `--primary` | `#c97b54` | **Cobre** — acento principal |
| `--amber` | `#d99a6c` | Cobre claro / CTAs |
| `--gold` | `#e7d7bd` | **Marfil dorado** — brillos, títulos |
| `--teal` | `#7fa08c` | **Salvia** — contra-acento frío puntual |
| `--rose` | `#b9596b` | Vino — errores / favoritos |
| `--foreground` | `#f3ede2` | **Marfil** — texto |
| `--muted` | `#9c8d7c` | Texto secundario |

### Modo claro
Fondo marfil `#f6f1e8`, texto `#2a2018`, cobre quemado `#a85c38`, salvia `#5d7d6c`.

**Jerarquía:** Primario = **cobre** · Brillo = **marfil dorado** · Contra-acento =
**salvia** · Fondo = **negro cálido** · Texto = **marfil**.

### Portadas de décadas (tonos vinilo, refinados)
60s marfil→cobre · 70s cobre→bronce · 80s salvia · 90s vino · 2000s ámbar,
todas degradando a `#0e0b09`.

## Tipografía (estado actual)

- **Titulares / años:** Bodoni Moda (Didone editorial fina — lujo de marquesina).
- **UI / cuerpo:** Inter.
- **Etiquetas / readouts:** Inter en mayúsculas con tracking.

## Regla Higgsfield para esta marca

Iconos 3D glass **teñidos en cobre `#c97b54` → marfil `#e7d7bd`, con chispa
salvia `#7fa08c`** sobre negro cálido `#0e0b09`. **Nunca** violeta/cyan por
default. Encuadre 78 %, grid normalizado, estética Apple premium sobre base
analógica cálida.

---

## Resolución de marca

El experimento “Morado Prince” (violeta + serif) quedó **descartado**. El código
se realineó a la identidad cálida del logo con la paleta **Vinilo & Cobre**
(commits `491d720`, `0b548d8`, `53e3b5b`). La app vive ahora en **una sola
pantalla** tipo rockola (`JukeboxHome`) con Cover Flow real. Esta marca cálida es
la canónica y **manda** en todo el rearmado VForge.

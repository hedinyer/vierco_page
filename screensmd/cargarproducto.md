# Guia paso a paso: Cargar producto

Este documento describe como usar la pagina `CargarProductoPage` para crear un producto completo en Supabase.

## 1) Entrar al formulario

1. Abre la ruta de carga de producto en la app.
2. Veras el formulario dividido por secciones:
   - `01 — Datos basicos`
   - `02 — Imagen principal`
   - `03 — Caracteristicas`
   - `04 — Galeria`

## 2) Completar datos basicos

En la seccion **01 — Datos basicos** completa:

1. **Nombre**: nombre comercial del producto (ej. `Oxford Ejecutivo`).
2. **Ref** y **Slug (URL)**: se generan automaticamente a partir del nombre.
   - No se muestran en el formulario.
   - Se guardan internamente al enviar.
3. **Descripcion**: texto descriptivo opcional.
4. **Precio (COP)**: precio mostrado (ej. `$450000`).
5. **Disponibilidad**: seleccionar una opcion:
   - `En stock`
   - `Sin stock`
6. **Tipo**: seleccionar una opcion:
   - `Hombre`
   - `Mujer`
   - `Industrial`
7. **Categoria** (selector dinamico segun tipo):
   - Si tipo es `Hombre` o `Mujer`: `Formal`, `Tennis`, `Sport`
   - Si tipo es `Industrial`: `Seguridad`
   - Si no hay tipo seleccionado, categoria queda deshabilitada.

## 3) Definir tallas y stock

En **Tallas y stock**:

1. Para cada talla (34 a 44), define la cantidad disponible.
2. Si una talla queda en `0`, se interpreta como agotada.

## 4) Configurar imagen principal

En la seccion **02 — Imagen principal** hay dos formas:

1. **Subir archivo** al bucket `images` (recomendado), o
2. **Pegar URL** directa de imagen principal.

Adicionalmente:

3. Completa **Alt text** (obligatorio).

Regla importante:

- Si subes archivo, la URL principal puede quedar vacia y el sistema usa la URL publica generada.
- Si no subes archivo, debes llenar `URL imagen principal`.

## 5) Completar caracteristicas del producto

En la seccion **03 — Caracteristicas**:

1. Se cargan 3 bloques por defecto (`TITULO #1`, `#2`, `#3`).
2. Cada bloque tiene:
   - `title`
   - `description`
3. Edita estos campos segun el producto.

## 6) Completar galeria (opcional)

En la seccion **04 — Galeria**:

1. Hay hasta 3 imagenes opcionales.
2. En cada bloque puedes:
   - Subir archivo al bucket.
   - O pegar URL manual.
   - Definir `alt` opcional.
3. Si subes archivo, el sistema reemplaza la URL con la URL publica generada.

## 7) Guardar producto

1. Haz clic en `GUARDAR PRODUCTO`.
2. El formulario:
   - Sube imagen principal si hay archivo.
   - Sube imagenes de galeria seleccionadas.
   - Arma el payload con datos basicos, tallas, caracteristicas e imagenes.
   - Ejecuta `createProductWithRelations`.

## 8) Confirmaciones y errores

- Si todo sale bien: mensaje `Producto creado correctamente`.
- Si falla:
  - Veras mensaje de error en la parte superior del formulario.
  - Corrige y vuelve a intentar.

## 9) Checklist rapido para agentes

Antes de enviar:

- [ ] `name` completo
- [ ] `price` definido
- [ ] `availability` seleccionado
- [ ] `tipo` seleccionado
- [ ] `categoria` compatible con `tipo`
- [ ] `altText` completo
- [ ] stock por talla revisado
- [ ] imagen principal definida (archivo o URL)
- [ ] `slug` y `ref` generados automaticamente por el sistema


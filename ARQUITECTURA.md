# Sistema Whitelist - Empresas Pilares

## Que es este sistema?

Una aplicacion web para trackear empresas con ventajas competitivas sostenibles (moats) y calcular automaticamente si estan a buen precio de compra basandose en tu precio objetivo.

---

## Como funciona?

Tu introduces los datos basicos de cada empresa en un Google Sheet, y el sistema automaticamente:

1. Obtiene el precio actual en tiempo real
2. Calcula si es buen momento para comprar
3. Te muestra todo en una tabla visual con filtros

---

## Que tienes que meter tu (Google Sheet)

| Campo | Que es | Ejemplo |
|-------|--------|---------|
| empresa | Nombre de la empresa | Microsoft Corporation |
| ticker | Simbolo de bolsa | NASDAQ:MSFT |
| industria | Sector | Tecnologia - Software |
| moat_principal | Ventaja competitiva | Ecosistema enterprise + Cloud |
| precio_objetivo | Tu precio estimado a 5 años | 450.00 |
| divisa_base | Moneda | USD |
| proximos_resultados | Fecha de earnings (opcional) | 2025-01-30 |

---

## Que calcula el sistema automaticamente

| Metrica | Que significa |
|---------|---------------|
| Precio actual | Precio de la accion ahora mismo |
| Retorno anual esperado | % que ganarias al año si alcanza tu precio objetivo |
| Retorno 5 años | % total que ganarias en 5 años |
| Precio para 15% anual | A que precio deberias comprar para conseguir un 15% anual |
| % Cotizacion 52 semanas | Donde esta el precio respecto al maximo/minimo del ultimo año |

---

## Como añadir una empresa nueva

1. Abre el Google Sheet
2. Añade una fila con los datos (empresa, ticker, industria, moat, precio objetivo, divisa)
3. Recarga la web o espera 30 segundos

La empresa aparecera automaticamente con todos los calculos hechos.

---

## Funcionalidades de la web

- **Busqueda**: Busca por nombre de empresa o ticker
- **Filtro por industria**: Ver solo empresas de un sector
- **Ordenacion**: Ordenar por retorno, nombre, etc.
- **Modo oscuro/claro**: Boton arriba a la derecha

---

## Limitaciones

- **Proximos Resultados**: Sale N/A porque no usamos API de pago. Si quieres que aparezca, metelo manual en la columna `proximos_resultados` del Google Sheet (formato: 2025-01-30)

- **Tickers**: Deben ser de bolsas americanas (NASDAQ, NYSE). Tickers europeos pueden no funcionar.

---

## Datos en tiempo real

Los precios se actualizan cada vez que recargas la pagina. El sistema tiene una cache de 30 segundos para no sobrecargar las peticiones.

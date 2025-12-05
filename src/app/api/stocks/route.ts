import { NextResponse } from 'next/server';
import { Empresa } from '@/types/empresa';

// Google Sheets público - Formato CSV
// Reemplaza SPREADSHEET_ID con el ID de tu Google Sheet
// El ID está en la URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
const SPREADSHEET_ID = '14Gfj8DU4E3GyVQjbym-OYbSWewJMy6u8qLRfxo9gLSY';

// URL para obtener CSV de Google Sheets público
const GOOGLE_SHEETS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;

// Cache para no hacer demasiadas llamadas
let cache: { data: Empresa[]; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 1000; // 30 segundos

// Función para extraer solo el símbolo del ticker
function getTickerSymbol(ticker: string): string {
  return ticker.includes(':') ? ticker.split(':')[1] : ticker;
}

// Funciones de cálculo
function calcularPrecioPara15Anual(precioObjetivo: number): number {
  return precioObjetivo / Math.pow(1.15, 5);
}

function calcularRetornoAnual(precioActual: number, precioObjetivo: number): number {
  if (precioActual <= 0) return 0;
  return (Math.pow(precioObjetivo / precioActual, 1 / 5) - 1) * 100;
}

function calcularRetorno5Anios(precioActual: number, precioObjetivo: number): number {
  if (precioActual <= 0) return 0;
  return ((precioObjetivo - precioActual) / precioActual) * 100;
}

function calcularPorcentaje52Semanas(precioActual: number, bajo: number, alto: number): number {
  if (alto === bajo) return 50;
  return ((precioActual - bajo) / (alto - bajo)) * 100;
}

// Parsear CSV a array de objetos
function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  // Primera línea son los headers
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());

  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = (values[index] || '').replace(/"/g, '').trim();
    });

    rows.push(row);
  }

  return rows;
}

// Obtener datos de Yahoo Finance (API gratuita)
async function fetchStockData(symbol: string) {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1y`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        next: { revalidate: 300 }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];

    if (!result) {
      throw new Error('No data');
    }

    const meta = result.meta;
    const quotes = result.indicators?.quote?.[0];

    const precioActual = meta.regularMarketPrice || meta.previousClose;
    const highs = quotes?.high?.filter((h: number) => h != null) || [];
    const lows = quotes?.low?.filter((l: number) => l != null) || [];

    return {
      precio_actual: precioActual,
      precio_52_semanas_alto: highs.length > 0 ? Math.max(...highs) : precioActual * 1.1,
      precio_52_semanas_bajo: lows.length > 0 ? Math.min(...lows) : precioActual * 0.9
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

// Obtener fecha de próximos earnings usando Finnhub (API gratuita)
// API Key gratuita de Finnhub - puedes obtener la tuya en https://finnhub.io/
const FINNHUB_API_KEY = 'ctq6prhr01qhb4a9pmggctq6prhr01qhb4a9pmh0';

async function fetchEarningsDate(symbol: string): Promise<string> {
  try {
    // Obtener fecha actual y fecha dentro de 3 meses
    const from = new Date().toISOString().split('T')[0];
    const toDate = new Date();
    toDate.setMonth(toDate.getMonth() + 3);
    const to = toDate.toISOString().split('T')[0];

    const response = await fetch(
      `https://finnhub.io/api/v1/calendar/earnings?from=${from}&to=${to}&symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return '';
    }

    const data = await response.json();

    if (data.earningsCalendar && data.earningsCalendar.length > 0) {
      // Buscar el próximo earnings para este símbolo
      const nextEarning = data.earningsCalendar.find(
        (e: { symbol: string }) => e.symbol === symbol
      );
      if (nextEarning?.date) {
        return nextEarning.date;
      }
    }

    return '';
  } catch (error) {
    console.error(`Error fetching earnings for ${symbol}:`, error);
    return '';
  }
}

// Leer datos de Google Sheets
async function leerGoogleSheets(): Promise<Array<{
  empresa: string;
  ticker: string;
  industria: string;
  moat_principal: string;
  precio_objetivo: number;
  divisa_base: string;
  proximos_resultados: string;
}>> {
  try {
    const response = await fetch(GOOGLE_SHEETS_CSV_URL, {
      cache: 'no-store' // Sin cache para obtener datos frescos
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo Google Sheets: ${response.status}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    console.log('Filas leídas de Google Sheets:', rows.length);

    return rows
      .filter(row => row['empresa'] && row['ticker'])
      .map(row => ({
        empresa: row['empresa'] || '',
        ticker: row['ticker'] || '',
        industria: row['industria'] || '',
        moat_principal: row['moat_principal'] || '',
        precio_objetivo: parseFloat(row['precio_objetivo']) || 0,
        divisa_base: row['divisa_base'] || 'USD',
        proximos_resultados: row['proximos_resultados'] || ''
      }));
  } catch (error) {
    console.error('Error leyendo Google Sheets:', error);
    // Datos de fallback
    return [
      {
        empresa: "Microsoft Corporation",
        ticker: "NASDAQ:MSFT",
        industria: "Tecnología - Software",
        moat_principal: "Ecosistema enterprise + Cloud",
        precio_objetivo: 450.00,
        divisa_base: "USD",
        proximos_resultados: ""
      },
      {
        empresa: "Apple Inc.",
        ticker: "NASDAQ:AAPL",
        industria: "Tecnología - Hardware",
        moat_principal: "Ecosistema iOS + Marca",
        precio_objetivo: 210.00,
        divisa_base: "USD",
        proximos_resultados: ""
      },
      {
        empresa: "Coca-Cola Company",
        ticker: "NYSE:KO",
        industria: "Consumo - Bebidas",
        moat_principal: "Marca + Red distribución",
        precio_objetivo: 72.00,
        divisa_base: "USD",
        proximos_resultados: ""
      }
    ];
  }
}

export async function GET() {
  try {
    // Verificar cache
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    // Leer empresas desde Google Sheets
    const empresasBase = await leerGoogleSheets();

    if (empresasBase.length === 0) {
      return NextResponse.json([]);
    }

    // Obtener datos de mercado para cada empresa
    const empresasConDatos: Empresa[] = await Promise.all(
      empresasBase.map(async (empresa) => {
        const symbol = getTickerSymbol(empresa.ticker);

        // Obtener datos de precio
        const stockData = await fetchStockData(symbol);

        // Usar fecha del Sheet, si no hay intentar con API
        let proximosResultados = empresa.proximos_resultados;
        if (!proximosResultados) {
          proximosResultados = await fetchEarningsDate(symbol);
        }

        if (!stockData || stockData.precio_actual <= 0) {
          return {
            ...empresa,
            precio_actual: 0,
            retorno_anual: 0,
            retorno_5_anios: 0,
            porcentaje_52_semanas: 50,
            precio_52_semanas_alto: 0,
            precio_52_semanas_bajo: 0,
            precio_para_15_anual: calcularPrecioPara15Anual(empresa.precio_objetivo),
            precio_objetivo_5_anios: 0,
            proximos_resultados: proximosResultados
          };
        }

        const precioActual = stockData.precio_actual;

        return {
          ...empresa,
          precio_actual: precioActual,
          retorno_anual: calcularRetornoAnual(precioActual, empresa.precio_objetivo),
          retorno_5_anios: calcularRetorno5Anios(precioActual, empresa.precio_objetivo),
          porcentaje_52_semanas: calcularPorcentaje52Semanas(
            precioActual,
            stockData.precio_52_semanas_bajo,
            stockData.precio_52_semanas_alto
          ),
          precio_52_semanas_alto: stockData.precio_52_semanas_alto,
          precio_52_semanas_bajo: stockData.precio_52_semanas_bajo,
          precio_para_15_anual: calcularPrecioPara15Anual(empresa.precio_objetivo),
          precio_objetivo_5_anios: precioActual * Math.pow(1.15, 5),
          proximos_resultados: proximosResultados
        };
      })
    );

    // Actualizar cache
    cache = { data: empresasConDatos, timestamp: Date.now() };

    return NextResponse.json(empresasConDatos);
  } catch (error) {
    console.error('Error in stocks API:', error);
    return NextResponse.json({ error: 'Error fetching stock data' }, { status: 500 });
  }
}

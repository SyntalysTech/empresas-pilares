import { Empresa } from '@/types/empresa';

// Datos base de las empresas (whitelist)
export const empresasBase: Omit<Empresa, 'precio_actual' | 'retorno_anual' | 'retorno_5_anios' | 'porcentaje_52_semanas' | 'precio_para_15_anual' | 'precio_objetivo_5_anios' | 'proximos_resultados' | 'precio_52_semanas_alto' | 'precio_52_semanas_bajo'>[] = [
  {
    empresa: "Microsoft Corporation",
    ticker: "NASDAQ:MSFT",
    industria: "Tecnología - Software",
    moat_principal: "Ecosistema enterprise + Cloud",
    precio_objetivo: 450.00,
    divisa_base: "USD"
  },
  {
    empresa: "Apple Inc.",
    ticker: "NASDAQ:AAPL",
    industria: "Tecnología - Hardware",
    moat_principal: "Ecosistema iOS + Marca",
    precio_objetivo: 210.00,
    divisa_base: "USD"
  },
  {
    empresa: "Coca-Cola Company",
    ticker: "NYSE:KO",
    industria: "Consumo - Bebidas",
    moat_principal: "Marca + Red distribución",
    precio_objetivo: 72.00,
    divisa_base: "USD"
  }
];

// Función para extraer solo el símbolo del ticker
export function getTickerSymbol(ticker: string): string {
  return ticker.includes(':') ? ticker.split(':')[1] : ticker;
}

// Función para calcular el precio necesario para obtener 15% anual en 5 años
export function calcularPrecioPara15Anual(precioObjetivo: number): number {
  // Precio actual = Precio objetivo / (1.15)^5
  return precioObjetivo / Math.pow(1.15, 5);
}

// Función para calcular el precio objetivo a 5 años dado un precio actual
export function calcularPrecioObjetivo5Anios(precioActual: number): number {
  // Asumiendo 15% anual compuesto
  return precioActual * Math.pow(1.15, 5);
}

// Función para calcular retorno anual esperado
export function calcularRetornoAnual(precioActual: number, precioObjetivo: number, anios: number = 5): number {
  // Retorno anual = ((Precio objetivo / Precio actual)^(1/años) - 1) * 100
  return (Math.pow(precioObjetivo / precioActual, 1 / anios) - 1) * 100;
}

// Función para calcular retorno total a 5 años
export function calcularRetorno5Anios(precioActual: number, precioObjetivo: number): number {
  return ((precioObjetivo - precioActual) / precioActual) * 100;
}

// Función para calcular porcentaje dentro del rango de 52 semanas
export function calcularPorcentaje52Semanas(precioActual: number, bajo: number, alto: number): number {
  if (alto === bajo) return 50;
  return ((precioActual - bajo) / (alto - bajo)) * 100;
}

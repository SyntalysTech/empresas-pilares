export interface Empresa {
  empresa: string;
  ticker: string;
  industria: string;
  moat_principal: string;
  precio_objetivo: number;
  divisa_base: string;
  // Datos calculados desde API
  precio_actual?: number;
  retorno_anual?: number;
  retorno_5_anios?: number;
  precio_52_semanas_alto?: number;
  precio_52_semanas_bajo?: number;
  porcentaje_52_semanas?: number;
  precio_para_15_anual?: number;
  precio_objetivo_5_anios?: number;
  proximos_resultados?: string;
}

export interface DatosResumen {
  total_empresas: number;
  empresas_con_retorno_15: number;
  retorno_promedio: number;
}

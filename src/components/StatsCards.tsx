'use client';

import { DatosResumen } from '@/types/empresa';

interface StatsCardsProps {
  datos: DatosResumen;
}

export default function StatsCards({ datos }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 text-center">
          {datos.total_empresas}
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-center mt-2">
          Empresas totales
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 text-center">
          {datos.empresas_con_retorno_15}
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-center mt-2">
          Con retorno ≥15%
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className={`text-4xl font-bold text-center ${
          datos.retorno_promedio >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {datos.retorno_promedio >= 0 ? '+' : ''}{datos.retorno_promedio.toFixed(2)}%
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-center mt-2">
          Retorno promedio
        </div>
      </div>
    </div>
  );
}

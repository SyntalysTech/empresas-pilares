'use client';

import { Empresa } from '@/types/empresa';

interface EmpresasTableProps {
  empresas: Empresa[];
}

function TickerBadge({ ticker }: { ticker: string }) {
  const symbol = ticker.includes(':') ? ticker.split(':')[1] : ticker;
  const exchange = ticker.includes(':') ? ticker.split(':')[0] : '';

  const bgColor = exchange === 'NASDAQ' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : exchange === 'NYSE' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${bgColor}`}>
      {symbol}
    </span>
  );
}

function ProgressBar52Semanas({ porcentaje }: { porcentaje: number }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{porcentaje.toFixed(2)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
          style={{ width: `${Math.min(100, Math.max(0, porcentaje))}%` }}
        />
      </div>
    </div>
  );
}

function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(value);
}

function formatRetorno(value: number): { text: string; className: string } {
  const formatted = `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  const className = value >= 0 ? 'text-green-500' : 'text-red-500';
  return { text: formatted, className };
}

export default function EmpresasTable({ empresas }: EmpresasTableProps) {
  if (empresas.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No se encontraron empresas</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ticker
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Industria
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                % Cotización 52s
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Retorno Anual
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Retorno 5 Años
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Precio para 15% Anual
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Precio Objetivo 5 Años
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Divisa
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Próximos Resultados
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {empresas.map((empresa, index) => {
              const retornoAnual = formatRetorno(empresa.retorno_anual || 0);
              const retorno5Anios = formatRetorno(empresa.retorno_5_anios || 0);

              return (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {empresa.empresa}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <TickerBadge ticker={empresa.ticker} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {empresa.industria}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap min-w-[120px]">
                    <ProgressBar52Semanas porcentaje={empresa.porcentaje_52_semanas || 0} />
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap font-semibold ${retornoAnual.className}`}>
                    {retornoAnual.text}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap font-semibold ${retorno5Anios.className}`}>
                    {retorno5Anios.text}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {formatCurrency(empresa.precio_para_15_anual || 0, empresa.divisa_base)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {formatCurrency(empresa.precio_objetivo_5_anios || 0, empresa.divisa_base)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {empresa.divisa_base}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {empresa.proximos_resultados || 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

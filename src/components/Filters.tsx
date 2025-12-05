'use client';

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedIndustria: string;
  setSelectedIndustria: (industria: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  industrias: string[];
}

export default function Filters({
  searchTerm,
  setSearchTerm,
  selectedIndustria,
  setSelectedIndustria,
  sortBy,
  setSortBy,
  industrias
}: FiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Buscar empresa o ticker
        </label>
        <input
          type="text"
          placeholder="Ej: Microsoft, AAPL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filtrar por industria
        </label>
        <select
          value={selectedIndustria}
          onChange={(e) => setSelectedIndustria(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Todas las industrias</option>
          {industrias.map((industria) => (
            <option key={industria} value={industria}>
              {industria}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ordenar por
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="retorno_5_anios_desc">Retorno 5 años (mayor a menor)</option>
          <option value="retorno_5_anios_asc">Retorno 5 años (menor a mayor)</option>
          <option value="retorno_anual_desc">Retorno anual (mayor a menor)</option>
          <option value="retorno_anual_asc">Retorno anual (menor a mayor)</option>
          <option value="empresa_asc">Nombre (A-Z)</option>
          <option value="empresa_desc">Nombre (Z-A)</option>
        </select>
      </div>
    </div>
  );
}

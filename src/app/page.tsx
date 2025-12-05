'use client';

import { useState, useEffect, useMemo } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import StatsCards from '@/components/StatsCards';
import Filters from '@/components/Filters';
import EmpresasTable from '@/components/EmpresasTable';
import StatusBanner from '@/components/StatusBanner';
import { Empresa, DatosResumen } from '@/types/empresa';

export default function Home() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustria, setSelectedIndustria] = useState('');
  const [sortBy, setSortBy] = useState('retorno_5_anios_desc');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/stocks');
        if (!response.ok) throw new Error('Error al cargar datos');
        const data = await response.json();
        setEmpresas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Obtener lista única de industrias
  const industrias = useMemo(() => {
    const unique = [...new Set(empresas.map((e) => e.industria))];
    return unique.sort();
  }, [empresas]);

  // Filtrar y ordenar empresas
  const empresasFiltradas = useMemo(() => {
    let filtered = [...empresas];

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.empresa.toLowerCase().includes(term) ||
          e.ticker.toLowerCase().includes(term)
      );
    }

    // Filtrar por industria
    if (selectedIndustria) {
      filtered = filtered.filter((e) => e.industria === selectedIndustria);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'retorno_5_anios_desc':
          return (b.retorno_5_anios || 0) - (a.retorno_5_anios || 0);
        case 'retorno_5_anios_asc':
          return (a.retorno_5_anios || 0) - (b.retorno_5_anios || 0);
        case 'retorno_anual_desc':
          return (b.retorno_anual || 0) - (a.retorno_anual || 0);
        case 'retorno_anual_asc':
          return (a.retorno_anual || 0) - (b.retorno_anual || 0);
        case 'empresa_asc':
          return a.empresa.localeCompare(b.empresa);
        case 'empresa_desc':
          return b.empresa.localeCompare(a.empresa);
        default:
          return 0;
      }
    });

    return filtered;
  }, [empresas, searchTerm, selectedIndustria, sortBy]);

  // Calcular datos de resumen
  const datosResumen: DatosResumen = useMemo(() => {
    const total = empresasFiltradas.length;
    const con15 = empresasFiltradas.filter((e) => (e.retorno_anual || 0) >= 15).length;
    const promedio = total > 0
      ? empresasFiltradas.reduce((sum, e) => sum + (e.retorno_anual || 0), 0) / total
      : 0;

    return {
      total_empresas: total,
      empresas_con_retorno_15: con15,
      retorno_promedio: promedio
    };
  }, [empresasFiltradas]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Whitelist - Empresas Pilares
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sistema de análisis y seguimiento de empresas con ventajas competitivas sostenibles
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Filtros */}
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedIndustria={selectedIndustria}
          setSelectedIndustria={setSelectedIndustria}
          sortBy={sortBy}
          setSortBy={setSortBy}
          industrias={industrias}
        />

        {/* Banner de estado */}
        <StatusBanner loading={loading} error={error} empresasCount={empresas.length} />

        {/* Cards de estadísticas */}
        {!loading && !error && <StatsCards datos={datosResumen} />}

        {/* Tabla de empresas */}
        {!loading && !error && <EmpresasTable empresas={empresasFiltradas} />}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          Sistema desarrollado por <span className="font-semibold">XenaCode</span> para Comunidad Whitelist
        </footer>
      </div>
    </div>
  );
}

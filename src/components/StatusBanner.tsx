'use client';

interface StatusBannerProps {
  loading: boolean;
  error: string | null;
  empresasCount: number;
}

export default function StatusBanner({ loading, error, empresasCount }: StatusBannerProps) {
  if (loading) {
    return (
      <div className="bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-center justify-center">
        <svg className="animate-spin h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-blue-700 dark:text-blue-300">Cargando datos de mercado...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <span className="text-red-700 dark:text-red-300">❌ {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex items-center justify-center">
      <span className="text-green-700 dark:text-green-300">
        ✓ Datos reales cargados desde Google Sheets ({empresasCount} empresas)
      </span>
    </div>
  );
}

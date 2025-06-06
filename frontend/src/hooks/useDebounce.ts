import { useState, useEffect } from 'react';

// ============================================================================
// DEBOUNCE HOOK - Para evitar requisições excessivas na busca
// ============================================================================

/**
 * Hook que implementa debounce para valores
 * @param value - Valor a ser "debounced"
 * @param delay - Delay em millisegundos (padrão: 500ms)
 * @returns Valor com debounce aplicado
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Criar timer para atualizar o valor após o delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: cancelar timer se value mudar antes do delay
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// ============================================================================
// SEARCH DEBOUNCE HOOK - Específico para busca
// ============================================================================

/**
 * Hook específico para busca com debounce
 * @param searchTerm - Termo de busca
 * @param delay - Delay em millisegundos (padrão: 800ms para busca)
 * @returns Termo de busca com debounce
 */
export function useSearchDebounce(searchTerm: string, delay: number = 800): string {
  return useDebounce(searchTerm, delay)
}
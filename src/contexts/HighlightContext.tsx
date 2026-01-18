import { createContext, useContext, useState, ReactNode } from 'react';

export interface HighlightState {
  servidorSelecionado: string | null;
  nivelDestacado: string | null;
  grauDestacado: string | null;
  referenciaDestacada: string | null;
  scrollToNivel: boolean;
  servidorData?: {
    nome: string;
    cargo: string;
    salario: number;
  };
}

interface HighlightContextType {
  highlightState: HighlightState;
  setHighlight: (
    nivel: string,
    grau: string,
    referencia: string,
    servidorData: { nome: string; cargo: string; salario: number }
  ) => void;
  clearHighlight: () => void;
}

const HighlightContext = createContext<HighlightContextType | undefined>(undefined);

export const HighlightProvider = ({ children }: { children: ReactNode }) => {
  const [highlightState, setHighlightState] = useState<HighlightState>({
    servidorSelecionado: null,
    nivelDestacado: null,
    grauDestacado: null,
    referenciaDestacada: null,
    scrollToNivel: false,
  });

  const setHighlight = (
    nivel: string,
    grau: string,
    referencia: string,
    servidorData: { nome: string; cargo: string; salario: number }
  ) => {
    setHighlightState({
      servidorSelecionado: servidorData.nome,
      nivelDestacado: nivel,
      grauDestacado: grau,
      referenciaDestacada: referencia,
      scrollToNivel: true,
      servidorData,
    });
  };

  const clearHighlight = () => {
    setHighlightState({
      servidorSelecionado: null,
      nivelDestacado: null,
      grauDestacado: null,
      referenciaDestacada: null,
      scrollToNivel: false,
    });
  };

  return (
    <HighlightContext.Provider value={{ highlightState, setHighlight, clearHighlight }}>
      {children}
    </HighlightContext.Provider>
  );
};

export const useHighlight = () => {
  const context = useContext(HighlightContext);
  if (context === undefined) {
    throw new Error('useHighlight must be used within a HighlightProvider');
  }
  return context;
};

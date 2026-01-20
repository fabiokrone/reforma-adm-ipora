import { supabase } from './supabase';
import { ServidorHistorico, NovoCargo, CargoExtincao, NivelSnapshot } from '../types';

export const fetchServidoresHistorico = async (): Promise<ServidorHistorico[]> => {
  const { data, error } = await supabase
    .from('rf_servidores_historico')
    .select('*')
    .eq('versao', 1)
    .order('nome');

  if (error) throw error;
  return data || [];
};

export const fetchNovosCargos = async (): Promise<NovoCargo[]> => {
  const { data, error } = await supabase
    .from('rf_novos_cargos')
    .select('*')
    .order('tipo', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const fetchCargosExtincao = async (): Promise<CargoExtincao[]> => {
  const { data, error } = await supabase
    .from('rf_cargos_extincao')
    .select('*')
    .order('cargo');

  if (error) throw error;
  return data || [];
};

export const fetchSnapshots = async (): Promise<{ antes: NivelSnapshot[], depois: NivelSnapshot[] }> => {
  const { data: antes, error: e1 } = await supabase
    .from('rf_niveis_snapshot')
    .select('*')
    .eq('versao', 1);

  const { data: depois, error: e2 } = await supabase
    .from('rf_niveis_snapshot')
    .select('*')
    .eq('versao', 2);

  if (e1 || e2) throw e1 || e2;
  return { antes: antes || [], depois: depois || [] };
};

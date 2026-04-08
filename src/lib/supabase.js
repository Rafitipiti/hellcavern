import { createClient } from '@supabase/supabase-js';

// Reemplaza estas variables en tu archivo .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iomxlkocwxwgdbfdvoxf.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3Ci4SGAU-KXGvLVTXPv6YA_nHPjN0Dm';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Guarda el resultado de la partida en la tabla 'match_history' de Supabase
 * @param {Object} data Datos de la partida a guardar
 */
export const saveMatchHistory = async (data) => {
  try {
    const { error } = await supabase
      .from('match_history')
      .insert([
        {
          nickname: data.nickname,
          game_state: data.gameState, // 'VICTORY' o 'GAMEOVER'
          turns_survived: data.turn,
          final_scenario: data.scenario,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error("Error guardando historial de partida:", error);
    } else {
      console.log("Historial de partida guardado exitosamente!");
    }
  } catch (err) {
    console.error("Excepción intentando guardar en Supabase:", err);
  }
};

/**
 * Obtiene las últimas 15 partidas del historial
 */
export const fetchMatchHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('match_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(15);

    if (error) {
      console.error("Error obteniendo el historial:", error);
      return [];
    }
    return data;
  } catch (err) {
    console.error("Excepción intentando obtener historial:", err);
    return [];
  }
};

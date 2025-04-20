import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CodeSection } from '@/types';

/**
 * Récupère la hiérarchie complète (chemin d'accès) d'un article donné via la fonction Postgres get_breadcrumb
 * @param articleId L'identifiant de l'article
 * @returns Un tableau ordonné du parent racine jusqu'à l'article
 */
export function useBreadcrumb(articleId: number | null) {
  const [breadcrumb, setBreadcrumb] = useState<CodeSection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!articleId) {
      setBreadcrumb([]);
      return;
    }
    let isMounted = true;
    async function fetchBreadcrumb(id: number) {
      setLoading(true);
      // Appel de la fonction Postgres get_breadcrumb via Supabase RPC
      const { data, error } = await supabase.rpc('get_breadcrumb', { article_id: id });
      if (!error && Array.isArray(data)) {
        // On suppose que la fonction retourne le chemin dans l'ordre racine -> feuille
        if (isMounted) setBreadcrumb(data as CodeSection[]);
      }
      setLoading(false);
    }
    fetchBreadcrumb(articleId);
    return () => { isMounted = false; };
  }, [articleId]);

  return { breadcrumb, loading };
}

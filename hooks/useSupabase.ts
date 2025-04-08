import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CodeSection, ArticleVersion, SearchResult } from '@/types';

export function useArticleSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);

  const searchByCode = async (code: string, sampleResults?: SearchResult[]) => {
    try {
      setLoading(true);
      setError(null);
      
      // If sample results are provided, use them instead of making an API call
      if (sampleResults) {
        setResults(sampleResults);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('code_sections')
        .select('id, code, title, content, type')
        .ilike('code', `%${code}%`)
        .limit(10);
      
      if (error) throw error;
      
      setResults(data as SearchResult[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const searchByText = async (query: string, sampleResults?: SearchResult[]) => {
    try {
      setLoading(true);
      setError(null);
      
      // If sample results are provided, use them instead of making an API call
      if (sampleResults) {
        setResults(sampleResults);
        setLoading(false);
        return;
      }
      
      // Using PostgreSQL full-text search
      const { data, error } = await supabase
        .from('code_sections')
        .select('id, code, title, content, type')
        .textSearch('search_vector', query, {
          config: 'french',
        })
        .limit(20);
      
      if (error) throw error;
      
      setResults(data as SearchResult[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    results,
    searchByCode,
    searchByText,
  };
}

export function useArticleDetails(articleId: number | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<CodeSection | null>(null);
  const [versions, setVersions] = useState<ArticleVersion[]>([]);

  useEffect(() => {
    if (articleId) {
      fetchArticle(articleId);
      fetchArticleVersions(articleId);
    }
  }, [articleId]);

  const fetchArticle = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('code_sections')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setArticle(data as CodeSection);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchArticleVersions = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('article_versions')
        .select('*')
        .eq('article_id', id)
        .order('effective_date', { ascending: false });
      
      if (error) throw error;
      
      setVersions(data as ArticleVersion[]);
    } catch (err) {
      console.error('Error fetching article versions:', err);
    }
  };

  return {
    loading,
    error,
    article,
    versions,
    refetch: () => {
      if (articleId) {
        fetchArticle(articleId);
        fetchArticleVersions(articleId);
      }
    },
  };
}

export function useHierarchy() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<CodeSection[]>([]);

  const fetchTopLevelSections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('code_sections')
        .select('*')
        .is('parent_id', null)
        .order('code');
      
      if (error) throw error;
      
      setSections(data as CodeSection[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildSections = async (parentId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('code_sections')
        .select('*')
        .eq('parent_id', parentId)
        .order('code');
      
      if (error) throw error;
      
      return data as CodeSection[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopLevelSections();
  }, []);

  return {
    loading,
    error,
    sections,
    fetchChildSections,
    refetch: fetchTopLevelSections,
  };
}

export function useBookmarks(userId: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      fetchBookmarks();
    }
  }, [userId]);

  const fetchBookmarks = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          code_sections:article_id (id, code, title, type)
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      setBookmarks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (articleId: number, notes?: string, folderId?: number) => {
    if (!userId) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          article_id: articleId,
          notes: notes || null,
          folder_id: folderId || null,
        })
        .select();
      
      if (error) throw error;
      
      fetchBookmarks();
      return data[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBookmark = async (id: number, updates: { notes?: string; folder_id?: number }) => {
    if (!userId) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('bookmarks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      fetchBookmarks();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (id: number) => {
    if (!userId) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      fetchBookmarks();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    bookmarks,
    addBookmark,
    updateBookmark,
    removeBookmark,
    refetch: fetchBookmarks,
  };
}

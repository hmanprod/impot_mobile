export type SectionType = 'livre' | 'partie' | 'titre' | 'chapitre' | 'section' | 'sous_titre' | 'article';

export interface CodeSection {
  id: number;
  parent_id: number | null;
  type: SectionType;
  code: string;
  title: string;
  content: string | null;
  page_number: number | null;
  version_date: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleVersion {
  id: number;
  article_id: number;
  version_content: string;
  effective_date: string;
  created_at: string;
}

export interface ArticleReference {
  source_article_id: number;
  target_article_id: number;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  font_size: 'small' | 'medium' | 'large';
  recent_searches: string[];
}

export interface Bookmark {
  id: number;
  user_id: string;
  article_id: number;
  folder_id: number | null;
  notes: string | null;
  created_at: string;
}

export interface Folder {
  id: number;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Highlight {
  id: number;
  user_id: string;
  article_id: number;
  text: string;
  color: string;
  created_at: string;
}

export interface SearchResult {
  id: number;
  code: string;
  title: string;
  content: string | null;
  type: SectionType;
  highlight: string;
}

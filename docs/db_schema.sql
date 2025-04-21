create table public.article_references (
  source_article_id integer not null,
  target_article_id integer not null,
  constraint article_references_pkey primary key (source_article_id, target_article_id),
  constraint article_references_source_article_id_fkey foreign KEY (source_article_id) references code_sections (id) on delete CASCADE,
  constraint article_references_target_article_id_fkey foreign KEY (target_article_id) references code_sections (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.article_versions (
  id serial not null,
  article_id integer null,
  version_content text not null,
  effective_date date not null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint article_versions_pkey primary key (id),
  constraint article_versions_article_id_fkey foreign KEY (article_id) references code_sections (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_article_versions_date on public.article_versions using btree (effective_date) TABLESPACE pg_default;

create table public.code_sections (
  id serial not null,
  parent_id integer null,
  type character varying(50) not null,
  code character varying(50) not null,
  title text not null,
  content text null,
  page_number_start integer null,
  version_date date null default CURRENT_DATE,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone null default CURRENT_TIMESTAMP,
  search_vector tsvector null,
  page_number_end integer null,
  constraint code_sections_pkey primary key (id),
  constraint code_sections_code_key unique (code),
  constraint code_sections_parent_id_fkey foreign KEY (parent_id) references code_sections (id) on delete CASCADE,
  constraint code_sections_type_check check (
    (
      (type)::text = any (
        array[
          ('livre'::character varying)::text,
          ('partie'::character varying)::text,
          ('titre'::character varying)::text,
          ('chapitre'::character varying)::text,
          ('section'::character varying)::text,
          ('sous_titre'::character varying)::text,
          ('article'::character varying)::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_code_sections_code on public.code_sections using btree (code) TABLESPACE pg_default;

create index IF not exists idx_code_sections_parent on public.code_sections using btree (parent_id) TABLESPACE pg_default;

create index IF not exists idx_code_sections_type on public.code_sections using btree (type) TABLESPACE pg_default;

create trigger tsvectorupdate BEFORE INSERT
or
update on code_sections for EACH row
execute FUNCTION tsvector_update_trigger(
  'search_vector',
  'pg_catalog.french',
  'title',
  'content'
);

create or replace view public.articles_with_breadcrumb as
select
  cs.id,
  cs.parent_id,
  cs.type,
  cs.code,
  cs.title,
  coalesce(av.version_content, cs.content) as content,
  cs.page_number_start,
  av.effective_date as version_date,
  cs.created_at,
  cs.updated_at,
  cs.search_vector,
  cs.page_number_end,
  (
    with recursive
      path as (
        select
          code_sections.id,
          code_sections.title,
          code_sections.parent_id
        from
          code_sections
        where
          code_sections.id = cs.id
        union all
        select
          cs2.id,
          cs2.title,
          cs2.parent_id
        from
          code_sections cs2
          join path path_1 on cs2.id = path_1.parent_id
      )
    select
      string_agg(
        path.title,
        ' > '::text
        order by
          path.id
      ) as string_agg
    from
      path
  ) as breadcrumb
from
  code_sections cs
  left join lateral (
    select *
    from article_versions
    where article_id = cs.id
    order by effective_date desc
    limit 1
  ) av on true;
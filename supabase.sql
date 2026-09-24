-- Rode este script uma vez no Supabase: SQL Editor > New query > cole tudo > Run

-- 1. Tabela onde ficam fotos, desejos, viagens, configurações e a carta
create table if not exists public.livrinho (
  id text primary key,
  colecao text not null,
  dados jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

alter table public.livrinho enable row level security;

drop policy if exists "livrinho ler" on public.livrinho;
drop policy if exists "livrinho criar" on public.livrinho;
drop policy if exists "livrinho editar" on public.livrinho;
drop policy if exists "livrinho apagar" on public.livrinho;
create policy "livrinho ler" on public.livrinho for select to anon using (true);
create policy "livrinho criar" on public.livrinho for insert to anon with check (true);
create policy "livrinho editar" on public.livrinho for update to anon using (true) with check (true);
create policy "livrinho apagar" on public.livrinho for delete to anon using (true);

-- 2. Atualização em tempo real (o que um adiciona aparece na hora pro outro)
do $$ begin
  alter publication supabase_realtime add table public.livrinho;
exception when duplicate_object then null; end $$;

-- 3. Pasta pública para as fotos (até 10 MB cada, só JPG)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 10485760, array['image/jpeg'])
on conflict (id) do nothing;

drop policy if exists "fotos ler" on storage.objects;
drop policy if exists "fotos enviar" on storage.objects;
drop policy if exists "fotos apagar" on storage.objects;
create policy "fotos ler" on storage.objects for select to anon using (bucket_id = 'fotos');
create policy "fotos enviar" on storage.objects for insert to anon with check (bucket_id = 'fotos');
create policy "fotos apagar" on storage.objects for delete to anon using (bucket_id = 'fotos');

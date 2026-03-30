create extension if not exists pgcrypto;

create table if not exists public.applications (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null,
	applicant_email text not null,
	status text not null default 'PENDING' check (status in ('INCOMPLETE', 'PENDING', 'APPROVED', 'REJECTED')),
	tin_number text not null,
	registration_identification_number text,
	zone_name text,
	region_name text,
	district_name text,
	location_summary text,
	physical_address text,
	postal_address text,
	form_data jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default timezone('utc', now()),
	updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.application_documents (
	id uuid primary key default gen_random_uuid(),
	application_id uuid not null references public.applications(id) on delete cascade,
	document_key text not null,
	file_name text not null,
	file_path text not null unique,
	mime_type text not null,
	file_size bigint not null,
	created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	email text not null unique,
	full_name text,
	region text,
	role text not null default 'USER',
	created_at timestamptz not null default timezone('utc', now()),
	updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.location_zones (
	id uuid primary key default gen_random_uuid(),
	name text not null unique,
	sort_order integer not null default 0,
	created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.location_regions (
	id uuid primary key default gen_random_uuid(),
	zone_id uuid not null references public.location_zones(id) on delete cascade,
	name text not null,
	sort_order integer not null default 0,
	created_at timestamptz not null default timezone('utc', now()),
	constraint location_regions_zone_name_key unique (zone_id, name)
);

create table if not exists public.location_districts (
	id uuid primary key default gen_random_uuid(),
	region_id uuid not null references public.location_regions(id) on delete cascade,
	name text not null,
	sort_order integer not null default 0,
	created_at timestamptz not null default timezone('utc', now()),
	constraint location_districts_region_name_key unique (region_id, name)
);

alter table public.applications add column if not exists zone_name text;
alter table public.applications add column if not exists region_name text;
alter table public.applications add column if not exists district_name text;

alter table public.applications drop constraint if exists applications_status_check;
alter table public.applications
	add constraint applications_status_check
	check (status in ('INCOMPLETE', 'PENDING', 'APPROVED', 'REJECTED'));

delete from public.location_districts;
delete from public.location_regions;
delete from public.location_zones;

insert into public.location_zones (name, sort_order)
values
	('SOUTHERN HIGHLANDS ZONE', 1),
	('EASTERN ZONE', 2),
	('LAKE ZONE', 3),
	('NORTHERN ZONE', 4),
	('CENTRAL ZONE', 5),
	('SOUTHERN ZONE', 6),
	('WESTERN ZONE', 7),
	('ZANZIBAR ZONE', 8)
on conflict (name) do update set sort_order = excluded.sort_order;

insert into public.location_regions (zone_id, name, sort_order)
select zone_lookup.id, region_seed.name, region_seed.sort_order
from (
	values
		('SOUTHERN HIGHLANDS ZONE', 'Mbeya', 1),
		('SOUTHERN HIGHLANDS ZONE', 'Iringa', 2),
		('SOUTHERN HIGHLANDS ZONE', 'Ruvuma', 3),
		('SOUTHERN HIGHLANDS ZONE', 'Rukwa', 4),
		('SOUTHERN HIGHLANDS ZONE', 'Songwe', 5),
		('SOUTHERN HIGHLANDS ZONE', 'Njombe', 6),
		('SOUTHERN HIGHLANDS ZONE', 'Katavi', 7),
		('EASTERN ZONE', 'Dar es Salaam', 1),
		('EASTERN ZONE', 'Pwani', 2),
		('EASTERN ZONE', 'Morogoro', 3),
		('LAKE ZONE', 'Mwanza', 1),
		('LAKE ZONE', 'Mara', 2),
		('LAKE ZONE', 'Kagera', 3),
		('LAKE ZONE', 'Geita', 4),
		('LAKE ZONE', 'Simiyu', 5),
		('LAKE ZONE', 'Shinyanga', 6),
		('NORTHERN ZONE', 'Arusha', 1),
		('NORTHERN ZONE', 'Kilimanjaro', 2),
		('NORTHERN ZONE', 'Manyara', 3),
		('NORTHERN ZONE', 'Tanga', 4),
		('CENTRAL ZONE', 'Dodoma', 1),
		('CENTRAL ZONE', 'Singida', 2),
		('SOUTHERN ZONE', 'Lindi', 1),
		('SOUTHERN ZONE', 'Mtwara', 2),
		('WESTERN ZONE', 'Tabora', 1),
		('WESTERN ZONE', 'Kigoma', 2),
		('ZANZIBAR ZONE', 'Unguja', 1),
		('ZANZIBAR ZONE', 'Pemba', 2)
) as region_seed(zone_name, name, sort_order)
join public.location_zones as zone_lookup on zone_lookup.name = region_seed.zone_name
on conflict (zone_id, name) do update set sort_order = excluded.sort_order;

insert into public.location_districts (region_id, name, sort_order)
select region_lookup.id, district_seed.name, district_seed.sort_order
from (
	values
		('Mbeya', 'Busokelo', 1),
		('Mbeya', 'Chunya', 2),
		('Mbeya', 'Kyela', 3),
		('Mbeya', 'Mbarali', 4),
		('Mbeya', 'Mbeya', 5),
		('Mbeya', 'Mbeya City', 6),
		('Mbeya', 'Rungwe', 7),
		('Iringa', 'Iringa', 1),
		('Iringa', 'Iringa Municipal', 2),
		('Iringa', 'Kilolo', 3),
		('Iringa', 'Mufindi', 4),
		('Ruvuma', 'Madaba', 1),
		('Ruvuma', 'Mbinga', 2),
		('Ruvuma', 'Mbinga Town', 3),
		('Ruvuma', 'Namtumbo', 4),
		('Ruvuma', 'Nyasa', 5),
		('Ruvuma', 'Songea', 6),
		('Ruvuma', 'Songea Municipal', 7),
		('Ruvuma', 'Tunduru', 8),
		('Rukwa', 'Kalambo', 1),
		('Rukwa', 'Nkasi', 2),
		('Rukwa', 'Sumbawanga', 3),
		('Rukwa', 'Sumbawanga Municipal', 4),
		('Songwe', 'Ileje', 1),
		('Songwe', 'Mbozi', 2),
		('Songwe', 'Momba', 3),
		('Songwe', 'Songwe', 4),
		('Songwe', 'Tunduma Town', 5),
		('Njombe', 'Ludewa', 1),
		('Njombe', 'Makambako Town', 2),
		('Njombe', 'Makete', 3),
		('Njombe', 'Njombe', 4),
		('Njombe', 'Njombe Town', 5),
		('Njombe', 'Wanging''ombe', 6),
		('Katavi', 'Mlele', 1),
		('Katavi', 'Mpanda', 2),
		('Katavi', 'Mpanda Municipal', 3),
		('Katavi', 'Nsimbo', 4),
		('Katavi', 'Tanganyika', 5),
		('Dar es Salaam', 'Ilala', 1),
		('Dar es Salaam', 'Kinondoni', 2),
		('Dar es Salaam', 'Kigamboni', 3),
		('Dar es Salaam', 'Temeke', 4),
		('Dar es Salaam', 'Ubungo', 5),
		('Pwani', 'Bagamoyo', 1),
		('Pwani', 'Chalinze', 2),
		('Pwani', 'Kibaha', 3),
		('Pwani', 'Kibaha Town', 4),
		('Pwani', 'Kisarawe', 5),
		('Pwani', 'Mafia', 6),
		('Pwani', 'Mkuranga', 7),
		('Pwani', 'Rufiji', 8),
		('Morogoro', 'Gairo', 1),
		('Morogoro', 'Ifakara Town', 2),
		('Morogoro', 'Kilombero', 3),
		('Morogoro', 'Kilosa', 4),
		('Morogoro', 'Malinyi', 5),
		('Morogoro', 'Morogoro', 6),
		('Morogoro', 'Morogoro Municipal', 7),
		('Morogoro', 'Mvomero', 8),
		('Morogoro', 'Ulanga', 9),
		('Mwanza', 'Buchosa', 1),
		('Mwanza', 'Ilemela', 2),
		('Mwanza', 'Kwimba', 3),
		('Mwanza', 'Magu', 4),
		('Mwanza', 'Misungwi', 5),
		('Mwanza', 'Nyamagana', 6),
		('Mwanza', 'Sengerema', 7),
		('Mwanza', 'Ukerewe', 8),
		('Mara', 'Bunda', 1),
		('Mara', 'Bunda Town', 2),
		('Mara', 'Butiama', 3),
		('Mara', 'Musoma', 4),
		('Mara', 'Musoma Municipal', 5),
		('Mara', 'Rorya', 6),
		('Mara', 'Serengeti', 7),
		('Mara', 'Tarime', 8),
		('Mara', 'Tarime Town', 9),
		('Kagera', 'Biharamulo', 1),
		('Kagera', 'Bukoba', 2),
		('Kagera', 'Bukoba Municipal', 3),
		('Kagera', 'Karagwe', 4),
		('Kagera', 'Kyerwa', 5),
		('Kagera', 'Missenyi', 6),
		('Kagera', 'Muleba', 7),
		('Kagera', 'Ngara', 8),
		('Geita', 'Bukombe', 1),
		('Geita', 'Chato', 2),
		('Geita', 'Geita', 3),
		('Geita', 'Geita Town', 4),
		('Geita', 'Mbogwe', 5),
		('Geita', 'Nyang''hwale', 6),
		('Simiyu', 'Bariadi', 1),
		('Simiyu', 'Bariadi Town', 2),
		('Simiyu', 'Busega', 3),
		('Simiyu', 'Itilima', 4),
		('Simiyu', 'Maswa', 5),
		('Simiyu', 'Meatu', 6),
		('Shinyanga', 'Kahama', 1),
		('Shinyanga', 'Kahama Town', 2),
		('Shinyanga', 'Kishapu', 3),
		('Shinyanga', 'Shinyanga', 4),
		('Shinyanga', 'Shinyanga Municipal', 5),
		('Shinyanga', 'Ushetu', 6),
		('Arusha', 'Arusha', 1),
		('Arusha', 'Arusha City', 2),
		('Arusha', 'Karatu', 3),
		('Arusha', 'Longido', 4),
		('Arusha', 'Meru', 5),
		('Arusha', 'Monduli', 6),
		('Arusha', 'Ngorongoro', 7),
		('Kilimanjaro', 'Hai', 1),
		('Kilimanjaro', 'Moshi', 2),
		('Kilimanjaro', 'Moshi Municipal', 3),
		('Kilimanjaro', 'Mwanga', 4),
		('Kilimanjaro', 'Rombo', 5),
		('Kilimanjaro', 'Same', 6),
		('Kilimanjaro', 'Siha', 7),
		('Manyara', 'Babati', 1),
		('Manyara', 'Babati Town', 2),
		('Manyara', 'Hanang', 3),
		('Manyara', 'Kiteto', 4),
		('Manyara', 'Mbulu', 5),
		('Manyara', 'Simanjiro', 6),
		('Tanga', 'Handeni', 1),
		('Tanga', 'Handeni Town', 2),
		('Tanga', 'Kilindi', 3),
		('Tanga', 'Korogwe', 4),
		('Tanga', 'Korogwe Town', 5),
		('Tanga', 'Lushoto', 6),
		('Tanga', 'Mkinga', 7),
		('Tanga', 'Muheza', 8),
		('Tanga', 'Pangani', 9),
		('Tanga', 'Tanga City', 10),
		('Dodoma', 'Bahi', 1),
		('Dodoma', 'Chamwino', 2),
		('Dodoma', 'Chemba', 3),
		('Dodoma', 'Dodoma City', 4),
		('Dodoma', 'Kondoa', 5),
		('Dodoma', 'Kondoa Town', 6),
		('Dodoma', 'Kongwa', 7),
		('Dodoma', 'Mpwapwa', 8),
		('Singida', 'Ikungi', 1),
		('Singida', 'Iramba', 2),
		('Singida', 'Manyoni', 3),
		('Singida', 'Mkalama', 4),
		('Singida', 'Singida', 5),
		('Singida', 'Singida Municipal', 6),
		('Lindi', 'Kilwa', 1),
		('Lindi', 'Lindi', 2),
		('Lindi', 'Lindi Municipal', 3),
		('Lindi', 'Liwale', 4),
		('Lindi', 'Nachingwea', 5),
		('Lindi', 'Ruangwa', 6),
		('Mtwara', 'Masasi', 1),
		('Mtwara', 'Masasi Town', 2),
		('Mtwara', 'Mtwara', 3),
		('Mtwara', 'Mtwara Municipal', 4),
		('Mtwara', 'Nanyumbu', 5),
		('Mtwara', 'Newala', 6),
		('Mtwara', 'Newala Town', 7),
		('Mtwara', 'Tandahimba', 8),
		('Tabora', 'Igunga', 1),
		('Tabora', 'Kaliua', 2),
		('Tabora', 'Nzega', 3),
		('Tabora', 'Nzega Town', 4),
		('Tabora', 'Sikonge', 5),
		('Tabora', 'Tabora', 6),
		('Tabora', 'Tabora Municipal', 7),
		('Tabora', 'Urambo', 8),
		('Tabora', 'Uyui', 9),
		('Kigoma', 'Buhigwe', 1),
		('Kigoma', 'Kakonko', 2),
		('Kigoma', 'Kasulu', 3),
		('Kigoma', 'Kasulu Town', 4),
		('Kigoma', 'Kibondo', 5),
		('Kigoma', 'Kigoma', 6),
		('Kigoma', 'Kigoma Ujiji Municipal', 7),
		('Kigoma', 'Uvinza', 8),
		('Unguja', 'Kaskazini A', 1),
		('Unguja', 'Kaskazini B', 2),
		('Unguja', 'Kati', 3),
		('Unguja', 'Kusini', 4),
		('Unguja', 'Magharibi A', 5),
		('Unguja', 'Magharibi B', 6),
		('Unguja', 'Mjini', 7),
		('Pemba', 'Chake Chake', 1),
		('Pemba', 'Micheweni', 2),
		('Pemba', 'Mkoani', 3),
		('Pemba', 'Wete', 4)
) as district_seed(region_name, name, sort_order)
join public.location_regions as region_lookup on region_lookup.name = district_seed.region_name
on conflict (region_id, name) do update set sort_order = excluded.sort_order;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = timezone('utc', now());
	return new;
end;
$$;

drop trigger if exists trg_applications_updated_at on public.applications;
drop trigger if exists trg_profiles_updated_at on public.profiles;

create trigger trg_applications_updated_at
before update on public.applications
for each row
execute procedure public.set_updated_at();

create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

begin;

alter table public.applications enable row level security;
alter table public.application_documents enable row level security;
alter table public.location_zones enable row level security;
alter table public.location_regions enable row level security;
alter table public.location_districts enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "Users can create their own applications" on public.applications;
drop policy if exists "Users can read their own applications" on public.applications;
drop policy if exists "Users can update their own applications" on public.applications;
drop policy if exists "Admin can update applications" on public.applications;
drop policy if exists "Users can create document metadata for own applications" on public.application_documents;
drop policy if exists "Users can read document metadata for own applications" on public.application_documents;
drop policy if exists "Admin can delete applications" on public.applications;
drop policy if exists "Authenticated users can read zones" on public.location_zones;
drop policy if exists "Authenticated users can read regions" on public.location_regions;
drop policy if exists "Authenticated users can read districts" on public.location_districts;
drop policy if exists "Admin manages zones" on public.location_zones;
drop policy if exists "Admin manages regions" on public.location_regions;
drop policy if exists "Admin manages districts" on public.location_districts;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can create their own applications"
on public.applications
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can read their own applications"
on public.applications
for select
to authenticated
using (
	auth.uid() = user_id
	or auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
);

create policy "Users can update their own applications"
on public.applications
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Admin can update applications"
on public.applications
for update
to authenticated
using (
	auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
)
with check (
	auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
);

create policy "Admin can delete applications"
on public.applications
for delete
to authenticated
using (
	auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
);

create policy "Users can create document metadata for own applications"
on public.application_documents
for insert
to authenticated
with check (
	exists (
		select 1
		from public.applications
		where public.applications.id = application_documents.application_id
			and public.applications.user_id = auth.uid()
	)
);

create policy "Users can read document metadata for own applications"
on public.application_documents
for select
to authenticated
using (
	exists (
		select 1
		from public.applications
		where public.applications.id = application_documents.application_id
			and (
				public.applications.user_id = auth.uid()
					or auth.uid() in (
						'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
						'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
						'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
					)
					or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
			)
	)
);

create policy "Authenticated users can read zones"
on public.location_zones
for select
to authenticated
using (true);

create policy "Authenticated users can read regions"
on public.location_regions
for select
to authenticated
using (true);

create policy "Authenticated users can read districts"
on public.location_districts
for select
to authenticated
using (true);

create policy "Admin manages zones"
on public.location_zones
for all
to authenticated
using (
	auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
)
with check (
	auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
);

create policy "Admin manages regions"
on public.location_regions
for all
to authenticated
using (
	auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
)
with check (
	auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
);

create policy "Admin manages districts"
on public.location_districts
for all
to authenticated
using (
	auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
)
with check (
	auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
);

create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (
	auth.uid() = id
	or auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
);

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (
	auth.uid() = id
	or auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (
	auth.uid() = id
	or auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
)
with check (
	auth.uid() = id
	or auth.uid() in (
		'32fbf24f-6a93-4a19-af06-eded5be88496'::uuid,
		'f4e128d3-7869-4637-9da9-15e44acaa6a1'::uuid,
		'c7325cea-ad1b-441b-af59-2b741292af90'::uuid
	)
	or auth.jwt() ->> 'email' in ('mbazzacodes@gmail.com', 'jumad@dstv.com', 'mika@dstv.com')
);

commit;

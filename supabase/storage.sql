begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
	'application-documents',
	'application-documents',
	false,
	5242880,
	array['image/jpeg', 'image/png', 'application/pdf']::text[]
)
on conflict (id) do update
set
	name = excluded.name,
	public = excluded.public,
	file_size_limit = excluded.file_size_limit,
	allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read application files" on storage.objects;
drop policy if exists "Users can upload application files" on storage.objects;
drop policy if exists "Users can update application files" on storage.objects;
drop policy if exists "Users can delete application files" on storage.objects;

create policy "Users can read application files"
on storage.objects
for select
to authenticated
using (
	bucket_id = 'application-documents'
	and split_part(name, '/', 1) = 'applications'
	and (
		auth.uid() = '32fbf24f-6a93-4a19-af06-eded5be88496'::uuid
		or auth.jwt() ->> 'email' = 'mbazzacodes@gmail.com'
		or exists (
			select 1
			from public.applications
			where public.applications.id::text = split_part(storage.objects.name, '/', 2)
				and public.applications.user_id = auth.uid()
		)
	)
);

create policy "Users can upload application files"
on storage.objects
for insert
to authenticated
with check (
	bucket_id = 'application-documents'
	and split_part(name, '/', 1) = 'applications'
	and (
		auth.uid() = '32fbf24f-6a93-4a19-af06-eded5be88496'::uuid
		or auth.jwt() ->> 'email' = 'mbazzacodes@gmail.com'
		or exists (
			select 1
			from public.applications
			where public.applications.id::text = split_part(storage.objects.name, '/', 2)
				and public.applications.user_id = auth.uid()
		)
	)
);

create policy "Users can update application files"
on storage.objects
for update
to authenticated
using (
	bucket_id = 'application-documents'
	and split_part(name, '/', 1) = 'applications'
	and (
		auth.uid() = '32fbf24f-6a93-4a19-af06-eded5be88496'::uuid
		or auth.jwt() ->> 'email' = 'mbazzacodes@gmail.com'
		or exists (
			select 1
			from public.applications
			where public.applications.id::text = split_part(storage.objects.name, '/', 2)
				and public.applications.user_id = auth.uid()
		)
	)
)
with check (
	bucket_id = 'application-documents'
	and split_part(name, '/', 1) = 'applications'
	and (
		auth.uid() = '32fbf24f-6a93-4a19-af06-eded5be88496'::uuid
		or auth.jwt() ->> 'email' = 'mbazzacodes@gmail.com'
		or exists (
			select 1
			from public.applications
			where public.applications.id::text = split_part(storage.objects.name, '/', 2)
				and public.applications.user_id = auth.uid()
		)
	)
);

create policy "Users can delete application files"
on storage.objects
for delete
to authenticated
using (
	bucket_id = 'application-documents'
	and split_part(name, '/', 1) = 'applications'
	and (
		auth.uid() = '32fbf24f-6a93-4a19-af06-eded5be88496'::uuid
		or auth.jwt() ->> 'email' = 'mbazzacodes@gmail.com'
		or exists (
			select 1
			from public.applications
			where public.applications.id::text = split_part(storage.objects.name, '/', 2)
				and public.applications.user_id = auth.uid()
		)
	)
);

commit;

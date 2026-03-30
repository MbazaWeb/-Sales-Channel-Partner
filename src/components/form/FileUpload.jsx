function FileUpload({ label, description, accept, file, error, onChange }) {
	return (
		<label className="block rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition hover:border-blue-400 hover:bg-blue-50/40">
			<span className="block text-sm font-semibold text-slate-900">{label}</span>
			<span className="mt-1 block text-sm text-slate-600">{description}</span>
			<input
				type="file"
				accept={accept}
				className="mt-4 block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800"
				onChange={(event) => onChange(event.target.files?.[0] ?? null)}
			/>
			<div className="mt-3 flex items-center justify-between gap-3">
				<span className="text-sm text-slate-500">{file ? file.name : 'No file selected'}</span>
				<span className="text-xs text-slate-500">Max 5MB</span>
			</div>
			{error ? <p className="mt-3 text-sm font-medium text-rose-700">{error}</p> : null}
		</label>
	)
}

export default FileUpload

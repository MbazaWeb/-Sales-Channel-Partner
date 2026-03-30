import Button from './Button.jsx'

function Modal({ title, description, isOpen, onClose, actions, children }) {
	if (!isOpen) {
		return null
	}

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-3 sm:items-center sm:p-4">
			<div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-950/20">
				<div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
					<div>
						<h2 className="text-xl font-semibold text-slate-900">{title}</h2>
						{description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
					</div>
					<Button variant="secondary" onClick={onClose}>
						Close
					</Button>
				</div>
				<div className="flex-1 overflow-auto px-4 py-4 sm:px-6 sm:py-5">{children}</div>
				{actions ? <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">{actions}</div> : null}
			</div>
		</div>
	)
}

export default Modal

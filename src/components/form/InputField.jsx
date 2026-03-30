import { PDF_BASE_HEIGHT, PDF_BASE_WIDTH } from '../../utils/constants.js'

function InputField({ field, value, error, onChange }) {
	const style = {
		top: `${(field.top / PDF_BASE_HEIGHT) * 100}%`,
		left: `${(field.left / PDF_BASE_WIDTH) * 100}%`,
		width: `${(field.width / PDF_BASE_WIDTH) * 100}%`,
		height: `${(field.height / PDF_BASE_HEIGHT) * 100}%`,
	}

	const className = error ? 'pdf-overlay-input border-rose-400 bg-rose-50/70' : 'pdf-overlay-input'

	if (field.type === 'textarea') {
		return (
			<div className="pdf-overlay-field" style={style} title={error || field.label}>
				<textarea
					className={error ? 'pdf-overlay-textarea border-rose-400 bg-rose-50/70' : 'pdf-overlay-textarea'}
					value={value}
					onChange={(event) => onChange(field, event.target.value)}
					aria-label={field.label}
				/>
			</div>
		)
	}

	return (
		<div className="pdf-overlay-field" style={style} title={error || field.label}>
			<input
				className={className}
				value={value}
				onChange={(event) => onChange(field, event.target.value)}
				aria-label={field.label}
			/>
		</div>
	)
}

export default InputField

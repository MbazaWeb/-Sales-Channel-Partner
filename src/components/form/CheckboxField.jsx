import { PDF_BASE_HEIGHT, PDF_BASE_WIDTH } from '../../utils/constants.js'

function CheckboxField({ field, checked, error, onChange }) {
	const style = {
		top: `${(field.top / PDF_BASE_HEIGHT) * 100}%`,
		left: `${(field.left / PDF_BASE_WIDTH) * 100}%`,
		width: `${(field.width / PDF_BASE_WIDTH) * 100}%`,
		height: `${(field.height / PDF_BASE_HEIGHT) * 100}%`,
	}

	return (
		<div className="pdf-overlay-field" style={style} title={error || field.label}>
			<button
				type="button"
				className={`pdf-overlay-checkbox ${checked ? 'is-checked' : ''}`}
				onClick={() => onChange(field, !checked)}
				aria-label={field.label}
				aria-pressed={checked}
			>
				<span className={error ? 'border-rose-400 bg-rose-50/70' : ''}></span>
			</button>
		</div>
	)
}

export default CheckboxField

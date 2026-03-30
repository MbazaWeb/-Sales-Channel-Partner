import CheckboxField from './CheckboxField.jsx'
import InputField from './InputField.jsx'
import { FORM_FIELDS_BY_PAGE } from '../../utils/constants.js'

function FormOverlay({ page, values, errors, onChange, role }) {
	const fields = (FORM_FIELDS_BY_PAGE[page] ?? []).filter((field) => !field.adminOnly || role === 'ADMIN')

	return (
		<div className="pdf-overlay-layer">
			{fields.map((field) =>
				field.type === 'checkbox' ? (
					<CheckboxField
						key={field.id}
						field={field}
						checked={Boolean(values[field.id])}
						error={errors[field.id]}
						onChange={onChange}
					/>
				) : (
					<InputField
						key={field.id}
						field={field}
						value={values[field.id] ?? ''}
						error={errors[field.id]}
						onChange={onChange}
					/>
				),
			)}
		</div>
	)
}

export default FormOverlay

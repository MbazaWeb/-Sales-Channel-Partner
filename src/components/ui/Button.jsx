const variantClasses = {
	primary: 'bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-700',
	secondary:
		'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 focus-visible:ring-slate-700',
	danger: 'bg-rose-700 text-white hover:bg-rose-800 focus-visible:ring-rose-700',
}

function Button({
	type = 'button',
	variant = 'primary',
	className = '',
	disabled = false,
	children,
	...props
}) {
	return (
		<button
			type={type}
			disabled={disabled}
			className={[
				'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
				variantClasses[variant],
				className,
			].join(' ')}
			{...props}
		>
			{children}
		</button>
	)
}

export default Button

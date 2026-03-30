function Card({ className = '', children }) {
	return (
		<section
			className={[
				'ui-surface-enter overflow-hidden rounded-[24px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/70 sm:rounded-[28px] sm:p-6',
				className,
			].join(' ')}
		>
			{children}
		</section>
	)
}

export default Card

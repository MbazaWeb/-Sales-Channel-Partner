function Card({ className = '', children }) {
	return (
		<section
			className={[
				'rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70',
				className,
			].join(' ')}
		>
			{children}
		</section>
	)
}

export default Card

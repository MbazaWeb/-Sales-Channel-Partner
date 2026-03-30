function Skeleton({ className = '' }) {
	return <div className={["skeleton-block", className].join(' ')} aria-hidden="true" />
}

export default Skeleton
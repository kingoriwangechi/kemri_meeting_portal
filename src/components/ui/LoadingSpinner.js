export default function LoadingSpinner({ size = "md", className = "" }) {
	// Define size classes
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-8 w-8",
		lg: "h-12 w-12",
	};

	const spinnerSize = sizeClasses[size] || sizeClasses.md;

	return (
		<div className={`flex items-center justify-center ${className}`}>
			<div
				className={`animate-spin rounded-full ${spinnerSize} border-b-2 border-blue-600`}
			></div>
		</div>
	);
}

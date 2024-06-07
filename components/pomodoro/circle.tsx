type InputProps = {
	handlePress: () => void;
};

export default function DrainingCircle({ handlePress }: InputProps) {
	return <div className="w-40 h-40 rounded-full" onClick={handlePress}></div>;
}

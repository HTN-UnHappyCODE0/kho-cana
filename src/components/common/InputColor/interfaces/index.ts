export interface PropsInputColor {
	label?: React.ReactNode | string;
	color: string;
	onSetColor: (color: string) => void;
}

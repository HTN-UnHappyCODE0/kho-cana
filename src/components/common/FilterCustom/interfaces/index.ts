export interface PropsFilterCustom {
	listFilter: {id: number | string | any; name: string}[];
	name: string;
	query: string;
	isSearch?: boolean;
	disabled?: boolean;
	all?: boolean;
}

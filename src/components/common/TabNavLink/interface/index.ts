export interface PropsTabNavLink {
	outline?: boolean;
	query: string;
	listHref: Array<{title: string; pathname: string; query: string | null}>;
}

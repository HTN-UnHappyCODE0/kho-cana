import {TYPE_RULER} from '~/constants/config/enum';

export interface PropsItemRuler {
	data: {
		uuid: string;
		titleType: string;
		rule: TYPE_RULER;
		value: number;
		order: number | string;
	};
	idx: number;
	showBtnDelete: boolean;
	handleDeleteRow: (index: number) => void;
	handleChangeValue: (index: number, name: string, value: any) => void;
	handleChangeValueSelectSearch: (index: number, updates: {[key: string]: any}) => void;
}

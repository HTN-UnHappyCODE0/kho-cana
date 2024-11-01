import {IWeightSession} from '~/components/pages/luot-can/MainWeightSessionAll/interfaces';

export interface PropsPopupChangeDryness {
	dataBillChangeDryness: IWeightSession[];
	onClose: () => void;
}

import {IQualities} from '../../MainQualities/interfaces';

export interface PropsFormUpdateQualities {
	onClose: () => void;
	dataUpdateQualities: IQualities | null;
}

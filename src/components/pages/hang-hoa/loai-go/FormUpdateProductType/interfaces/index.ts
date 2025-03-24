import {IProductType} from '../../MainProductType/interfaces';

export interface PropsFormUpdateProductType {
	onClose: () => void;
	dataUpdateProductType: IProductType | null;
}

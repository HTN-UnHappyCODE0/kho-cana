import {ITableBillScale} from '../../PageUpdatePort/interfaces';

export interface PropsFormUpdatePort {
	listBatchBillSubmit: ITableBillScale[];
	onClose: () => void;
}

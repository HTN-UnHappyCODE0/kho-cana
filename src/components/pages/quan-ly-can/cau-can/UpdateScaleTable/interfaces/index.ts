import {IScalesMachine} from '../../MainScaleTable/interfaces';

export interface PropsUpdateScaleTable {
	onClose: () => void;
	dataUpdate: IScalesMachine | null;
}

export interface IFormUpdate {
	name: string;
	scalesStationUuid: string;
	description: string;
}

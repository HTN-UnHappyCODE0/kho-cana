import {IRFID} from '../../MainPageRFID/interfaces';

export interface PropsUpdateRFID {
	onClose: () => void;
	dataUpdateRFID: IRFID | null;
}

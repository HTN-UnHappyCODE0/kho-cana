import {IWeightSession} from '../../../quy-cach/MainSpecification/interfaces';

export interface PropsBoxUpdateSpec {
	dataUpdateSpec: IWeightSession | null;
	onClose: () => void;
}

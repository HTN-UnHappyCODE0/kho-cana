export interface PropsAddScalesMachine {
	onClose: () => void;
	nameScalesStation: string;
	uuidScalesStation: string;
	listScalesMachineUuid: string[];
}

export interface IFormAddScalesMachine {
	scalesMachineUuid: string;
	nameScalesStation: string;
}

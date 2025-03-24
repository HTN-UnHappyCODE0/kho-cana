// Hàm chuyển đổi số coin thành chuỗi định dạng tiền tệ
export const convertCoin = (coin: number | null) => {
	return coin ? coin.toLocaleString('de-DE', {maximumFractionDigits: 2}) : '0';
};

// Hàm chuyển đổi chuỗi hoặc số thành giá trị số
export const price = (value: string | number): number => {
	const numericValue = Number(`${value}`.replace(/[^0-9,]/g, '').replace(',', '.'));
	return isNaN(numericValue) ? 0 : numericValue;
};

// Hàm đảm bảo giá trị phần trăm nằm trong khoảng từ 0 đến 100
export const specification = (value: string | number): number | string => {
	// Chuyển đổi giá trị sang số thập phân bằng hàm price
	const numericValue = price(value);

	// Kiểm tra giới hạn từ 0 đến 100
	if (numericValue < 0) {
		return 0;
	}
	if (numericValue > 100) {
		return 100;
	}
	return numericValue;
};

export const convertCoinBet = (coin: number) => {
	if (coin >= 1000 && coin < 10000) {
		return convertCoin(coin);
	}
	if (coin >= 10000 && coin < 1000000) {
		return `${(coin / 1000).toFixed(1).replace('.', ',')}K`;
	}
	if (coin >= 1000000 && coin < 1000000000) {
		return `${(coin / 1000000).toFixed(1).replace('.', ',')}M`;
	}
	if (coin >= 1000000000) {
		return `${(coin / 1000000000).toFixed(1).replace('.', ',')}B`;
	}

	return coin.toLocaleString('de-DE');
};

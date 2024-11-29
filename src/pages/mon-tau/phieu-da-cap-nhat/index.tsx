import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainPageBillUpdate from '~/components/pages/mon-tau/phieu-da-cap-nhat/MainPageBillUpdate';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Phiếu đã cập nhật</title>
				<meta name='description' content='Phiếu đã cập nhật' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Cập nhật khối lượng theo mớn tàu',
						url: PATH.CapNhatMonTau,
					},
					{
						title: 'Phiếu đã cập nhật',
						url: PATH.PhieuDaCapNhat,
					},
				]}
			>
				<MainPageBillUpdate />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý mớn tàu>'>{Page}</BaseLayout>;
};

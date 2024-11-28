import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainPageDraftShip from '~/components/pages/mon-tau/cap-nhat-mon-tau/MainPageDraftShip';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Cập nhật mớn tàu</title>
				<meta name='description' content='Cập nhật mớn tàu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Cập nhật mớn tàu',
						url: PATH.CapNhatMonTau,
					},
					{
						title: 'Phiếu đã cập nhật',
						url: PATH.PhieuDaCapNhat,
					},
				]}
			>
				<MainPageDraftShip />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý mớn tàu'>{Page}</BaseLayout>;
};

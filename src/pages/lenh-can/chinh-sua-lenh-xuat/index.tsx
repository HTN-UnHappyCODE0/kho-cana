import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainUpdateExport from '~/components/pages/lenh-can/MainUpdateExport';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa lệnh cân xuất</title>
				<meta name='description' content='Chỉnh sửa lệnh cân xuất' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainUpdateExport />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý lệnh cân'>{Page}</BaseLayout>;
};

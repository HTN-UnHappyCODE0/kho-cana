import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import DetailCustomerExport from '~/components/pages/khach-hang-xuat/DetailCustomerExport';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Khách hàng xuất</title>
				<meta name='description' content='Khách hàng xuất' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<DetailCustomerExport />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý khách hàng xuất'>{Page}</BaseLayout>;
};

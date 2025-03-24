import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageDelverTruck from '~/components/pages/xe-hang/MainPageDelverTruck';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý xe hàng</title>
				<meta name='description' content='Quản lý xe hàng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageDelverTruck />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý xe hàng'>{Page}</BaseLayout>;
};

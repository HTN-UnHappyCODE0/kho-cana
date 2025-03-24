import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageCreateTruck from '~/components/pages/xe-hang/MainPageCreateTruck';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm mới xe hàng</title>
				<meta name='description' content='Thêm mới xe hàng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageCreateTruck />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Thêm mới xe hàng'>{Page}</BaseLayout>;
};

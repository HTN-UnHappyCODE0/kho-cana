import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageUpdateTruck from '~/components/pages/xe-hang/MainPageUpdateTruck';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa xe hàng</title>
				<meta name='description' content='Chỉnh sửa xe hàng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageUpdateTruck />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chỉnh sửa xe hàng'>{Page}</BaseLayout>;
};

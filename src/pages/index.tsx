import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainDashboard from '~/components/pages/trang-chu/MainDashboard';

export default function Home() {
	return (
		<Fragment>
			<Head>
				<title>Trang chủ</title>
				<meta name='description' content='Trang chủ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={false}>
				<MainDashboard />
			</WrapperContainer>
		</Fragment>
	);
}

Home.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Báo cáo tổng quan'>{Page}</BaseLayout>;
};

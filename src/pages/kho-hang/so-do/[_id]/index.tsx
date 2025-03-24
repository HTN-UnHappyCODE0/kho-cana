import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainMapWarehouse from '~/components/pages/kho-hang/MainMapWarehouse';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết sơ đồ</title>
				<meta name='description' content='Chi tiết sơ đồ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainMapWarehouse />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Chi tiết sơ đồ'>
			{Page}
		</BaseLayout>
	);
};

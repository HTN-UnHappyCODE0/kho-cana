import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainUpdateWarehouse from '~/components/pages/kho-hang/MainUpdateWarehouse';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa kho hàng chính</title>
				<meta name='description' content='Chỉnh sửa kho hàng chính' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainUpdateWarehouse />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Chỉnh sửa kho hàng chính'>
			{Page}
		</BaseLayout>
	);
};

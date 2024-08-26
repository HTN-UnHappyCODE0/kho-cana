import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainUpdateMapWarehouse from '~/components/pages/kho-hang/MainUpdateMapWarehouse';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa sơ đồ</title>
				<meta name='description' content='Chỉnh sửa sơ đồ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainUpdateMapWarehouse />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Chỉnh sửa sơ đồ'>
			{Page}
		</BaseLayout>
	);
};

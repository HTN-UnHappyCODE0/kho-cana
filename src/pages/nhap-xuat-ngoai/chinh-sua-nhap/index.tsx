import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainUpdateImport from '~/components/pages/nhap-xuat-ngoai/MainUpdateImport';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa nhập ngoài hệ thống</title>
				<meta name='description' content='Chỉnh sửa nhập ngoài hệ thống' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainUpdateImport />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chỉnh sửa nhập ngoài hệ thống'>{Page}</BaseLayout>;
};

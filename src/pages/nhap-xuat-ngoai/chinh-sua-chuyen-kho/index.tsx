import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainUpdateTransfer from '~/components/pages/lenh-can/MainUpdateTransfer';
import MainUpdateImport from '~/components/pages/nhap-xuat-ngoai/MainUpdateImport';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa chuyển kho ngoài hệ thống</title>
				<meta name='description' content='Chỉnh sửa chuyển kho ngoài hệ thống' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainUpdateTransfer />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chỉnh sửa chuyển kho ngoài hệ thống'>{Page}</BaseLayout>;
};

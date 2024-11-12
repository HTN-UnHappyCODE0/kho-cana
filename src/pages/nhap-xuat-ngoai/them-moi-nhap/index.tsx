import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainCreateImport from '~/components/pages/nhap-xuat-ngoai/MainCreateImport';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm mới nhập ngoài hệ thống</title>
				<meta name='description' content='Thêm mới nhập ngoài hệ thống' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainCreateImport />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Thêm mới nhập ngoài hệ thống'>{Page}</BaseLayout>;
};

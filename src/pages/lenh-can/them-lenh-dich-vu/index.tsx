import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainCreateService from '~/components/pages/lenh-can/MainCreateService';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm mới lệnh cân dịch vụ</title>
				<meta name='description' content='Thêm mới lệnh cân dịch vụ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainCreateService />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý lệnh cân'>{Page}</BaseLayout>;
};

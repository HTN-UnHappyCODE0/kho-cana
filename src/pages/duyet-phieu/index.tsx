import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageConfirmBill from '~/components/pages/duyet-phieu/PageConfirmBill';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Duyệt phiếu</title>
				<meta name='description' content='Duyệt phiếu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<PageConfirmBill />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý kho'>{Page}</BaseLayout>;
};

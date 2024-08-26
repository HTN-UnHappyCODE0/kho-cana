import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageConfirmOutput from '~/components/pages/duyet-san-luong/PageConfirmOutput';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Duyệt sản lượng</title>
				<meta name='description' content='Duyệt sản lượng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<PageConfirmOutput />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý kế toán kho'>{Page}</BaseLayout>;
};

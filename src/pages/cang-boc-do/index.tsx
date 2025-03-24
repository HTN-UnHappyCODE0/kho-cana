import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageUpdatePort from '~/components/pages/cang-boc-do/PageUpdatePort';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Cập nhật cảng bốc dỡ</title>
				<meta name='description' content='Cập nhật cảng bốc dỡ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<PageUpdatePort />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý kế toán kho'>{Page}</BaseLayout>;
};

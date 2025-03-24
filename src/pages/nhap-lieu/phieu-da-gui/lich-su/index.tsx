import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainHistoryBillSend from '~/components/pages/nhap-lieu/phieu-da-gui/MainHistoryBillSend';
export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Lịch sử thay đổi lô</title>
				<meta name='description' content='Lịch sử thay đổi lô' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainHistoryBillSend />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight title='Lịch sử thay đổi lô'>
			{Page}
		</BaseLayout>
	);
};

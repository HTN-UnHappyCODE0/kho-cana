import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainSendAccountant from '~/components/pages/gui-ke-toan/MainSendAccountant';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Duyệt độ khô</title>
				<meta name='description' content='Duyệt độ khô' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainSendAccountant />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Duyệt độ khô'>{Page}</BaseLayout>;
};

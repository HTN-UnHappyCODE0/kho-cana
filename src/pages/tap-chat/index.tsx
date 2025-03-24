import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageWeightReject from '~/components/pages/tap-chat/MainPageWeightReject';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Khối lượng tạp chất</title>
				<meta name='description' content='RFID' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageWeightReject />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý khối lượng tạp chất'>{Page}</BaseLayout>;
};

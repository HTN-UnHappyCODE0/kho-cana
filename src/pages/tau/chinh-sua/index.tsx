import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageUpdateShip from '~/components/pages/tau/MainPageUpdateShip';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa tàu </title>
				<meta name='description' content='Chỉnh sửa tàu ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageUpdateShip />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chỉnh sửa tàu '>{Page}</BaseLayout>;
};

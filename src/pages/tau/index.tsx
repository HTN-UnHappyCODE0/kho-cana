import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageShip from '~/components/pages/tau/MainPageShip';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý tàu</title>
				<meta name='description' content='Quản lý tàu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageShip />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý tàu'>{Page}</BaseLayout>;
};

import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageCreateShip from '~/components/pages/tau/MainPageCreateShip';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm mới tàu </title>
				<meta name='description' content='Thêm mới tàu ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageCreateShip />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Thêm mới tàu '>{Page}</BaseLayout>;
};

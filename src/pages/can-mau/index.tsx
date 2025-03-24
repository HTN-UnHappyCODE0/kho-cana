import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageSampleSession from '~/components/pages/can-mau/MainPageSampleSession';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Cân mẫu</title>
				<meta name='description' content='Cân mẫu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageSampleSession />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Cân mẫu'>{Page}</BaseLayout>;
};

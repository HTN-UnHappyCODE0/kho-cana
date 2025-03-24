import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainDetailWeighingStation from '~/components/pages/quan-ly-can/tram-can/MainDetailWeighingStation';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết trạm cân</title>
				<meta name='description' content='Chi tiết trạm cân' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainDetailWeighingStation />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết trạm cân'>{Page}</BaseLayout>;
};

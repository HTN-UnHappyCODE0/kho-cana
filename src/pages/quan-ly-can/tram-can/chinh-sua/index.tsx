import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import UpdateWeighingStation from '~/components/pages/quan-ly-can/tram-can/UpdateWeighingStation';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa trạm cân</title>
				<meta name='description' content='Chỉnh sửa trạm cân' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer>
				<UpdateWeighingStation />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chỉnh sửa trạm cân'>{Page}</BaseLayout>;
};

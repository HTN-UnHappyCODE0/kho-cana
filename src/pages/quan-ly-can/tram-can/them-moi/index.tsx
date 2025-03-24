import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import CreateWeighingStation from '~/components/pages/quan-ly-can/tram-can/CreateWeighingStation';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm mới trạm cân</title>
				<meta name='description' content='Thêm mới trạm cân' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer>
				<CreateWeighingStation />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Thêm mới trạm cân'>{Page}</BaseLayout>;
};

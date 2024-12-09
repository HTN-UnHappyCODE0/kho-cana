import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageSampleDryness from '~/components/pages/can-mau-do-kho/MainPageSampleDryness';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Độ khô cân mẫu</title>
				<meta name='description' content='Độ khô cân mẫu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageSampleDryness />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Độ khô cân mẫu'>{Page}</BaseLayout>;
};

import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageSampleSpec from '~/components/pages/can-mau-quy-cach/MainPageSampleSpec';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quy cách cân mẫu</title>
				<meta name='description' content='Quy cách cân mẫu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageSampleSpec />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quy cách cân mẫu'>{Page}</BaseLayout>;
};

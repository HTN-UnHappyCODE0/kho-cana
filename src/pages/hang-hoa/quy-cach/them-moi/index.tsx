import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import CreateSpecifications from '~/components/pages/hang-hoa/quy-cach/CreateSpecifications';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm quy cách</title>
				<meta name='description' content='Thêm quy cách' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer>
				<CreateSpecifications />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Thêm quy cách'>
			{Page}
		</BaseLayout>
	);
};

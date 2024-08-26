import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import UpdateSpecifications from '~/components/pages/hang-hoa/quy-cach/UpdateSpecifications';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa quy cách</title>
				<meta name='description' content='Chỉnh sửa quy cách' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer>
				<UpdateSpecifications />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Chỉnh sửa quy cách'>
			{Page}
		</BaseLayout>
	);
};

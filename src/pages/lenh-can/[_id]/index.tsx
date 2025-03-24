import Head from 'next/head';
import {useRouter} from 'next/router';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainDetailBill from '~/components/pages/lenh-can/MainDetailBill';

export default function Page() {
	const router = useRouter();

	const {_storage} = router.query;

	return (
		<Fragment>
			<Head>
				<title>Chi tiết lệnh cân</title>
				<meta name='description' content='Chi tiết lệnh cân' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer>
				<MainDetailBill />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Chi tiết lệnh cân'>
			{Page}
		</BaseLayout>
	);
};

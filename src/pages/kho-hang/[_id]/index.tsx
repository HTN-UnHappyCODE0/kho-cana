import Head from 'next/head';
import {useRouter} from 'next/router';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import DetailStorage from '~/components/pages/kho-hang/PageDetailWarehouse/DetailStorage';
import DetailWarehouse from '~/components/pages/kho-hang/PageDetailWarehouse/DetailWarehouse';

export default function Page() {
	const router = useRouter();

	const {_storage} = router.query;

	return (
		<Fragment>
			<Head>
				<title>Chi tiết kho hàng</title>
				<meta name='description' content='Chi tiết kho hàng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer>{!!_storage ? <DetailStorage /> : <DetailWarehouse />}</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Chi tiết kho hàng'>
			{Page}
		</BaseLayout>
	);
};

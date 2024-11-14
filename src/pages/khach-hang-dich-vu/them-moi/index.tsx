import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import CreateCustomerService from '~/components/pages/khach-hang-dich-vu/CreateCustomerService';
export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm mới khách hàng dịch vụ</title>
				<meta name='description' content='Thêm mới khách hàng dịch vụ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<CreateCustomerService />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Khách hàng dịch vụ'>{Page}</BaseLayout>;
};

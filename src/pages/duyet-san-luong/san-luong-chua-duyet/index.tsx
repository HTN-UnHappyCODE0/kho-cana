import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import PageNotConfirmOutput from '~/components/pages/duyet-san-luong/PageNotConfirmOutput';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Duyệt sản lượng</title>
				<meta name='description' content='Duyệt sản lượng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Sản lượng chưa duyệt',
						url: PATH.SanLuongChuaDuyet,
					},
					{
						title: 'Sản lượng đã duyệt',
						url: PATH.SanLuongDaDuyet,
					},
				]}
			>
				<PageNotConfirmOutput />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý kế toán kho'>{Page}</BaseLayout>;
};

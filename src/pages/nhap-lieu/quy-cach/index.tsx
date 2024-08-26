import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainSpecification from '~/components/pages/nhap-lieu/quy-cach/MainSpecification';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Nhập liệu quy cách</title>
				<meta name='description' content='Nhập liệu quy cách' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Quy cách',
						url: PATH.NhapLieuQuyCach,
					},
					{
						title: 'Độ khô',
						url: PATH.NhapLieuDoKho,
					},
					{
						title: 'Phiếu đã gửi',
						url: PATH.NhapLieuPhieuDaGui,
					},
				]}
			>
				<MainSpecification />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý nhập liệu'>{Page}</BaseLayout>;
};

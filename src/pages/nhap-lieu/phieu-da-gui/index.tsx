import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainBillSend from '~/components/pages/nhap-lieu/phieu-da-gui/MainBillSend';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Nhập liệu phiếu đã gửi</title>
				<meta name='description' content='Nhập liệu phiếu đã gửi' />
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
				<MainBillSend />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý Nhập liệu'>{Page}</BaseLayout>;
};

import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainPageImport from '~/components/pages/nhap-xuat-ngoai/MainPageImport';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Nhập/xuất ngoài hệ thống</title>
				<meta name='description' content='Nhập/xuất ngoài hệ thống' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Tất cả',
						url: PATH.NhapXuatNgoaiTatCa,
					},
					{
						title: 'Nhập hàng',
						url: PATH.NhapXuatNgoaiNhapHang,
					},
					{
						title: 'Xuất hàng',
						url: PATH.NhapXuatNgoaiXuatHang,
					},
					{
						title: 'Xuất thẳng',
						url: PATH.NhapXuatNgoaiXuatThang,
					},
				]}
			>
				<MainPageImport />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Nhập/xuất ngoài hệ thống'>{Page}</BaseLayout>;
};

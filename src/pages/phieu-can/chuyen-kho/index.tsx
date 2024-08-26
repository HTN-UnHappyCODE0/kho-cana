import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainPageScalesTransfer from '~/components/pages/phieu-can/MainPageScalesTransfer';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Phiếu cân</title>
				<meta name='description' content='Phiếu cân' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Tất cả',
						url: PATH.PhieuCanTatCa,
					},
					{
						title: 'Phiếu nhập',
						url: PATH.PhieuCanNhap,
					},
					{
						title: 'Phiếu xuất',
						url: PATH.PhieuCanXuat,
					},
					{
						title: 'Dịch vụ',
						url: PATH.PhieuCanDichVu,
					},
					{
						title: 'Chuyển kho',
						url: PATH.PhieuCanChuyenKho,
					},
					{
						title: 'Xuất thẳng',
						url: PATH.PhieuCanXuatThang,
					},
				]}
			>
				<MainPageScalesTransfer />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý phiếu cân'>{Page}</BaseLayout>;
};

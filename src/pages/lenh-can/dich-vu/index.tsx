import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainPageBillService from '~/components/pages/lenh-can/MainPageBillService';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Lệnh cân dịch vụ</title>
				<meta name='description' content='Lệnh cân dịch vụ' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Tất cả',
						url: PATH.PhieuDuKienTatCa,
					},
					{
						title: 'Phiếu nhập',
						url: PATH.PhieuDuKienNhap,
					},
					{
						title: 'Phiếu xuất',
						url: PATH.PhieuDuKienXuat,
					},
					{
						title: 'Dịch vụ',
						url: PATH.PhieuDuKienDichVu,
					},
					{
						title: 'Chuyển kho',
						url: PATH.PhieuDuKienChuyenKho,
					},
					{
						title: 'Cân xuất thẳng',
						url: PATH.PhieuDuKienXuatThang,
					},
				]}
			>
				<MainPageBillService />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý Lệnh cân dịch vụ'>{Page}</BaseLayout>;
};

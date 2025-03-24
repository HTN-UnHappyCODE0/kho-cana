import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainWeightSessionDirect from '~/components/pages/luot-can/MainWeightSessionDirect';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Lượt cân xuất thẳng</title>
				<meta name='description' content='Lượt cân xuất thẳng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Tất cả',
						url: PATH.LuotCanTatCa,
					},
					{
						title: 'Phiếu nhập',
						url: PATH.LuotCanNhap,
					},
					{
						title: 'Phiếu xuất',
						url: PATH.LuotCanXuat,
					},
					{
						title: 'Dịch vụ',
						url: PATH.LuotCanDichVu,
					},
					{
						title: 'Chuyển kho',
						url: PATH.LuotCanChuyenKho,
					},
					{
						title: 'Xuất thẳng',
						url: PATH.LuotCanXuatThang,
					},
					{
						title: 'Nhóm theo xe',
						url: PATH.LuotCanGomTheoXe,
					},
				]}
			>
				<MainWeightSessionDirect />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý lượt cân xuất thẳng'>{Page}</BaseLayout>;
};

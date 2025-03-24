import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageConfirmBill from '~/components/pages/duyet-phieu/PageConfirmBill';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Duyệt phiếu</title>
				<meta name='description' content='Duyệt phiếu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Phiếu chưa duyệt',
						url: PATH.PhieuChuaDuyet,
					},
					{
						title: 'Phiếu đã duyệt',
						url: PATH.PhieuDaDuyet,
					},
				]}
			>
				<PageConfirmBill />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Duyệt phiếu'>{Page}</BaseLayout>;
};

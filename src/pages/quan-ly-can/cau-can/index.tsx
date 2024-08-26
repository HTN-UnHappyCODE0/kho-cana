import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainScaleTable from '~/components/pages/quan-ly-can/cau-can/MainScaleTable';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý trạm cân</title>
				<meta name='description' content='Quản lý trạm cân' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Trạm cân',
						url: PATH.TramCan,
					},
					{
						title: 'Cầu cân',
						url: PATH.CauCan,
					},
				]}
			>
				<MainScaleTable />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight title='Quản lý trạm cân'>
			{Page}
		</BaseLayout>
	);
};

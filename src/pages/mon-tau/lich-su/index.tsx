import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainHistoryUpdateDraftShip from '~/components/pages/mon-tau/phieu-da-cap-nhat/MainHistoryUpdateDraftShip';
export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Lịch sử thay đổi mớn tàu</title>
				<meta name='description' content='Lịch sử thay đổi mớn tàu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainHistoryUpdateDraftShip />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight title='Lịch sử thay đổi mớn tàu'>
			{Page}
		</BaseLayout>
	);
};

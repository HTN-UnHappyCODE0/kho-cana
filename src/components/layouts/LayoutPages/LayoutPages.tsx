import TabNavPage from '~/components/common/TabNavPage';
import WrapperContainer from '../WrapperContainer';
import {PropsLayoutPages} from './interfaces';

import styles from './LayoutPages.module.scss';

function LayoutPages({children, listPages}: PropsLayoutPages) {
	return (
		<WrapperContainer>
			<TabNavPage listPages={listPages} />

			<div className={styles.main}>{children}</div>
		</WrapperContainer>
	);
}

export default LayoutPages;

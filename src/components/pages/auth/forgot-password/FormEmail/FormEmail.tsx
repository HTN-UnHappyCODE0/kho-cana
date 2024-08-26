import React, {useContext} from 'react';

import {PropsFormEmail} from './interfaces';
import styles from './FormEmail.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import {ContextForgotPassword, IContextForgotPassword} from '../context';
import {Sms} from 'iconsax-react';
import Button from '~/components/common/Button';
import {useRouter} from 'next/router';
import Popup from '~/components/common/Popup';
import FormOTP from '../FormOTP';

function FormEmail({}: PropsFormEmail) {
	const router = useRouter();

	const {open, ...rest} = router.query;

	const context = useContext<IContextForgotPassword>(ContextForgotPassword);

	const handleSendEmail = () => {
		router.replace(
			{
				query: {...router.query, open: 'otp'},
			},
			undefined,
			{scroll: false}
		);
	};

	return (
		<div>
			<Form form={context.form} setForm={context.setForm} onSubmit={handleSendEmail}>
				<Input
					type='text'
					name='email'
					value={context?.form?.email}
					placeholder='Nhập email'
					onClean
					isRequired
					isEmail
					icon={<Sms size='20' variant='Bold' />}
					label={
						<span>
							Email <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>

				<div className={styles.btn}>
					<FormContext.Consumer>
						{({isDone}) => (
							<Button primary bold rounded_8 disable={!isDone}>
								Lấy lại mật khẩu
							</Button>
						)}
					</FormContext.Consumer>
				</div>
			</Form>

			<Popup
				open={open == 'otp'}
				onClose={() =>
					router.replace(
						{
							query: rest,
						},
						undefined,
						{scroll: false}
					)
				}
			>
				<FormOTP />
			</Popup>
		</div>
	);
}

export default FormEmail;

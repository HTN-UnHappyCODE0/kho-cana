import clsx from 'clsx';
import React, {useState} from 'react';

import Button from '~/components/common/Button';
import Form, {FormContext, Input} from '~/components/common/Form';
import {IFormCreateTruck, PropsMainPageCreateTruck} from './interfaces';
import styles from './MainPageCreateTruck.module.scss';
import TextArea from '~/components/common/Form/components/TextArea';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	OWNEW_TYPE_TRUCK,
	QUERY_KEY,
	REGENCY_NAME,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import truckServices from '~/services/truckServices';
import Loading from '~/components/common/Loading';
import {PATH} from '~/constants/config';
import ButtonSelectMany from '~/components/common/ButtonSelectMany';
import rfidServices from '~/services/rfidServices';
import {toastWarn} from '~/common/funcs/toast';
import {useRouter} from 'next/router';
import {price} from '~/common/funcs/convertCoin';
import regencyServices from '~/services/regencyServices';
import userServices from '~/services/userServices';

function MainPageCreateTruck({}: PropsMainPageCreateTruck) {
	const router = useRouter();

	const [listRFIDChecked, setListRFIDChecked] = useState<any[]>([]);

	const [form, setForm] = useState<IFormCreateTruck>({
		code: '',
		licensePalate: '',
		managerUuid: '',
		trucktype: '',
		ownerType: OWNEW_TYPE_TRUCK.XE_CONG_TY,
		minWeight: 0,
		maxWeight: 0,
		averageWeight: 0,
		description: '',
	});

	const listRFID = useQuery([QUERY_KEY.dropdown_RFID], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: rfidServices.listRFID({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listRegency = useQuery([QUERY_KEY.dropdown_chuc_vu], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: regencyServices.listRegency({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listUser = useQuery([QUERY_KEY.dropdown_quan_ly_xe], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: userServices.listUser({
					page: 1,
					pageSize: 50,
					keyword: '',
					regencyUuid: listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý xe'])
						? listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý xe'])?.uuid
						: null,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					provinceIDOwer: '',
					regencyUuidExclude: '',
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	const funcCreateTruck = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới xe thành công!',
				http: truckServices.upsertTruck({
					uuid: '',
					code: form?.code,
					licensePalate: form?.licensePalate,
					managerUuid: form?.managerUuid,
					ownerType: form?.ownerType,
					rfidUuid: listRFIDChecked?.map((v: any) => v?.uuid) || [],
					trucktype: form?.trucktype,
					minWeight: price(form?.minWeight),
					maxWeight: price(form?.maxWeight),
					description: form.description,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					code: '',
					licensePalate: '',
					managerUuid: '',
					trucktype: '',
					ownerType: OWNEW_TYPE_TRUCK.XE_CONG_TY,
					minWeight: 0,
					maxWeight: 0,
					averageWeight: 0,
					description: '',
				});
				setListRFIDChecked([]);
				router.replace(PATH.QuanLyXe, undefined, {
					scroll: false,
					locale: false,
				});
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		if (price(form.minWeight) > price(form.maxWeight)) {
			return toastWarn({
				msg: 'Khối lượng không hợp lệ!',
			});
		}

		return funcCreateTruck.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcCreateTruck.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Thêm xe hàng</h4>
						<p>Điền đầy đủ các thông tin xe hàng</p>
					</div>
					<div className={styles.right}>
						<Button href={PATH.QuanLyXe} p_10_24 rounded_2 grey_outline>
							Hủy bỏ
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 rounded_2 primary>
									Lưu lại
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</div>
				<div className={styles.form}>
					<div className={clsx('col_2', 'mt')}>
						<Input
							name='trucktype'
							value={form.trucktype || ''}
							isRequired
							max={255}
							type='text'
							blur={true}
							label={
								<span>
									Loại xe <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập loại xe'
						/>
						<div>
							<Input
								name='licensePalate'
								value={form.licensePalate || ''}
								isRequired
								max={255}
								type='text'
								blur={true}
								label={
									<span>
										Biển số <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='VD: 14B69699'
							/>
						</div>
					</div>
					<div className={clsx('col_2', 'mt')}>
						<Input
							name='code'
							value={form.code || ''}
							max={255}
							type='text'
							blur={true}
							label={<span>Logo xe</span>}
							placeholder='Nhập logo xe'
						/>
						<div>
							<div className={styles.item}>
								<label className={styles.label}>
									Phân loại xe <span style={{color: 'red'}}>*</span>
								</label>
								<div className={styles.group_radio}>
									<div className={styles.item_radio}>
										<input
											type='radio'
											id='xe_cong_ty'
											name='ownerType'
											checked={form.ownerType == OWNEW_TYPE_TRUCK.XE_CONG_TY}
											onChange={() =>
												setForm((prev) => ({
													...prev,
													ownerType: OWNEW_TYPE_TRUCK.XE_CONG_TY,
												}))
											}
										/>
										<label htmlFor='xe_cong_ty'>Xe KV cảng xuất khẩu</label>
									</div>
									<div className={styles.item_radio}>
										<input
											type='radio'
											id='xe_khach_hang'
											name='ownerType'
											checked={form.ownerType == OWNEW_TYPE_TRUCK.XE_KHACH_HANG}
											onChange={() =>
												setForm((prev) => ({
													...prev,
													ownerType: OWNEW_TYPE_TRUCK.XE_KHACH_HANG,
												}))
											}
										/>
										<label htmlFor='xe_khach_hang'>Xe khách hàng</label>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className={clsx('col_2', 'mt')}>
						{/* <div>
							<Input
								name='averageWeight'
								value={form.averageWeight || ''}
								type='text'
								isMoney
								unit='Tấn'
								blur={true}
								label={<span>Khối lượng trung bình</span>}
								placeholder='Nhập khối lượng trung bình'
							/>
						</div> */}
						<div>
							<Input
								name='minWeight'
								value={form.minWeight || ''}
								type='text'
								isMoney
								unit='Tấn'
								blur={true}
								label={
									<span>
										Khối lượng nhỏ nhất <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập khối lượng nhỏ nhất'
							/>
						</div>

						<Input
							name='maxWeight'
							value={form.maxWeight || ''}
							type='text'
							isMoney
							unit='Tấn'
							blur={true}
							label={
								<span>
									Khối lượng lớn nhất <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập khối lượng lớn nhất'
						/>
					</div>

					<div className={clsx('mt')}>
						<ButtonSelectMany
							isShowCheckAll={false}
							isShowCode={false}
							label={<span>RFID</span>}
							placeholder='Chọn RFID'
							title='Thêm RFID'
							description='Thêm và lựa chọn RFID'
							dataList={
								listRFID?.data?.map((v: any) => ({
									uuid: v?.uuid,
									name: v?.code,
									code: v?.code,
								})) || []
							}
							dataChecked={listRFIDChecked}
							setDataChecked={setListRFIDChecked}
						/>
					</div>

					{form.ownerType == OWNEW_TYPE_TRUCK.XE_CONG_TY && (
						<div className={clsx('mt')}>
							<Select
								isSearch
								name='managerUuid'
								placeholder='Chọn người quản lý'
								value={form?.managerUuid}
								onChange={(e: any) =>
									setForm((prev: any) => ({
										...prev,
										managerUuid: e.target.value,
									}))
								}
								label={<span>Người quản lý</span>}
							>
								{listUser?.data?.map((v: any) => (
									<Option key={v?.uuid} value={v?.uuid} title={v?.fullName} />
								))}
							</Select>
						</div>
					)}

					<div className={clsx('mt')}>
						<TextArea name='description' placeholder='Nhập ghi chú' label={<span>Ghi chú</span>} max={5000} blur />
					</div>
				</div>
			</Form>
		</div>
	);
}

export default MainPageCreateTruck;

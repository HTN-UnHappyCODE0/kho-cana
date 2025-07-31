import React, {useState} from 'react';
import {IFormCreate, PropsCreateWeighingStation} from './interfaces';
import styles from './CreateWeighingStation.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import TextArea from '~/components/common/Form/components/TextArea';
import clsx from 'clsx';
import {PATH} from '~/constants/config';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import {useRouter} from 'next/router';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import companyServices from '~/services/companyServices';
import commonServices from '~/services/commonServices';
import scalesStationServices from '~/services/scalesStationServices';

function CreateWeighingStation({}: PropsCreateWeighingStation) {
	const router = useRouter();

	const [form, setForm] = useState<IFormCreate>({
		name: '',
		code: '',
		address: '',
		description: '',
		phoneNumber: '',
		companyUuid: '',
		provinceId: '',
		townId: '',
	});

	const listCompany = useQuery([QUERY_KEY.dropdown_cong_ty], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: companyServices.listCompany({
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

	const listProvince = useQuery([QUERY_KEY.dropdown_tinh_thanh_pho], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: commonServices.listProvince({
					keyword: '',
					status: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listTown = useQuery([QUERY_KEY.dropdown_xa_phuong, form.provinceId], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: commonServices.listTown({
					keyword: '',
					status: null,
					idParent: form.provinceId,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form?.provinceId,
	});

	const funcAddScalesstation = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới trạm cân thành công!',
				http: scalesStationServices.upsertScalesstation({
					uuid: '',
					...form,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					name: '',
					code: '',
					address: '',
					description: '',
					phoneNumber: '',
					companyUuid: '',
					provinceId: '',
					townId: '',
				});
				router.replace(PATH.TramCan, undefined, {
					scroll: false,
					shallow: false,
				});
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		if (!form.companyUuid) {
			return toastWarn({msg: 'Vui lòng chọn KV cảng xuất khẩu!'});
		}

		return funcAddScalesstation.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcAddScalesstation.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Thêm trạm cân</h4>
						<p>Điền đầy đủ các thông tin trạm cân</p>
					</div>
					<div className={styles.right}>
						<Button href={PATH.TramCan} p_10_24 rounded_2 grey_outline>
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
					<div className={clsx('mt', 'col_2')}>
						<Input
							name='code'
							value={form.code || ''}
							isRequired
							max={255}
							type='text'
							blur={true}
							label={
								<span>
									Mã trạm cân <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập mã trạm cân'
						/>
						<div>
							<Input
								name='name'
								value={form.name || ''}
								isRequired
								max={255}
								type='text'
								blur={true}
								label={
									<span>
										Tên trạm cân <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập tên trạm cân'
							/>
						</div>
					</div>

					<div className={clsx('mt', 'col_2')}>
						<div>
							<Select
								isSearch
								name='companyUuid'
								value={form.companyUuid}
								placeholder='Chọn KV cảng xuất khẩu'
								onChange={(e) =>
									setForm((prev: any) => ({
										...prev,
										companyUuid: e.target.value,
									}))
								}
								label={
									<span>
										Thuộc KV cảng xuất khẩu <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listCompany?.data?.map((v: any) => (
									<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
								))}
							</Select>
						</div>

						<Input
							name='phoneNumber'
							value={form.phoneNumber || ''}
							isRequired
							isPhone
							type='number'
							blur={true}
							label={
								<span>
									Số điện thoại<span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập số điện thoại'
						/>
					</div>

					<div className={clsx('mt', 'col_2')}>
						<Select
							isSearch
							name='provinceId'
							value={form.provinceId}
							placeholder='Chọn tỉnh/thành phố'
							label={<span>Tỉnh/Thành phố</span>}
						>
							{listProvince?.data?.map((v: any) => (
								<Option
									key={v?.matp}
									value={v?.matp}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											provinceId: v?.matp,
											townId: '',
										}))
									}
								/>
							))}
						</Select>
						<div>
							<Select isSearch name='townId' value={form.townId} placeholder='Chọn xã/phường' label={<span>Xã/phường</span>}>
								{listTown?.data?.map((v: any) => (
									<Option
										key={v?.xaid}
										value={v?.xaid}
										title={v?.name}
										onClick={() =>
											setForm((prev: any) => ({
												...prev,
												townId: v?.xaid,
											}))
										}
									/>
								))}
							</Select>
						</div>
					</div>
					<div className={clsx('mt')}>
						<Input
							name='address'
							value={form.address || ''}
							max={255}
							type='text'
							label={<span>Địa chỉ chi tiết</span>}
							placeholder='Nhập địa chỉ chi tiết'
						/>
					</div>
					<div className={clsx('mt')}>
						<TextArea placeholder='Nhập ghi chú' name='description' label={<span>Ghi chú</span>} blur max={5000} />
					</div>
				</div>
			</Form>
		</div>
	);
}

export default CreateWeighingStation;

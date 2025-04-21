import React, {useEffect, useState} from 'react';

import {PropsFormUpdateProductType} from './interfaces';
import styles from './FormUpdateProductType.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import TextArea from '~/components/common/Form/components/TextArea';
import clsx from 'clsx';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_PRODUCT} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import InputColor from '~/components/common/InputColor';
import Select, {Option} from '~/components/common/Select';
import companyServices from '~/services/companyServices';

function FormUpdateProductType({dataUpdateProductType, onClose}: PropsFormUpdateProductType) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{
		uuid: string;
		name: string;
		productType: TYPE_PRODUCT;
		description: string;
		colorShow: string;
		companyUuid: string;
		fullName: string;
		normalName: string;
		scientificName: string;
		speciesGroup: string;
	}>({
		uuid: '',
		name: '',
		description: '',
		colorShow: '',
		productType: TYPE_PRODUCT.CONG_TY,
		companyUuid: '',
		fullName: '',
		normalName: '',
		scientificName: '',
		speciesGroup: '',
	});

	useEffect(() => {
		setForm({
			uuid: dataUpdateProductType?.uuid || '',
			name: dataUpdateProductType?.name || '',
			description: dataUpdateProductType?.description || '',
			productType: dataUpdateProductType?.type || TYPE_PRODUCT.CONG_TY,
			colorShow: dataUpdateProductType?.colorShow || '#16DBCC',
			companyUuid: dataUpdateProductType?.companyUu?.uuid || '',
			fullName: dataUpdateProductType?.fullName || '',
			normalName: dataUpdateProductType?.normalName || '',
			scientificName: dataUpdateProductType?.scientificName || '',
			speciesGroup: dataUpdateProductType?.speciesGroup || '',
		});
	}, [dataUpdateProductType]);

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

	const funcUpdateProductType = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa loại hàng thành công!',
				http: wareServices.upsertProductType({
					uuid: form.uuid,
					name: form.name,
					description: form.description,
					type: form.productType,
					colorShow: form.colorShow,
					companyUuid: form.companyUuid,
					fullName: form.fullName,
					normalName: form.normalName,
					scientificName: form.scientificName,
					speciesGroup: form.speciesGroup,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					uuid: '',
					name: '',
					description: '',
					productType: TYPE_PRODUCT.CONG_TY,
					colorShow: '',
					companyUuid: '',
					fullName: '',
					normalName: '',
					scientificName: '',
					speciesGroup: '',
				});
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_loai_go]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = () => {
		if (!form.uuid) {
			return toastWarn({
				msg: 'Không tìm thấy loại hàng!',
			});
		}

		return funcUpdateProductType.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateProductType.isLoading} />
			<h4>Chỉnh sửa loại hàng</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={clsx('mb')}>
					<div className={styles.item}>
						<label className={styles.label}>
							Sử dụng <span style={{color: 'red'}}>*</span>
						</label>
						<div className={styles.group_radio}>
							<div className={styles.item_radio}>
								<input
									type='radio'
									id='cong_ty'
									name='productType'
									checked={form.productType == TYPE_PRODUCT.CONG_TY}
									onChange={() =>
										setForm((prev) => ({
											...prev,
											productType: TYPE_PRODUCT.CONG_TY,
										}))
									}
								/>
								<label htmlFor='cong_ty'>Công ty</label>
							</div>
							<div className={styles.item_radio}>
								<input
									type='radio'
									id='dich_vu'
									name='productType'
									checked={form.productType == TYPE_PRODUCT.DICH_VU}
									onChange={() =>
										setForm((prev) => ({
											...prev,
											productType: TYPE_PRODUCT.DICH_VU,
										}))
									}
								/>
								<label htmlFor='dich_vu'>Dịch vụ</label>
							</div>
							<div className={styles.item_radio}>
								<input
									type='radio'
									id='dung_chung'
									name='productType'
									checked={form.productType == TYPE_PRODUCT.DUNG_CHUNG}
									onChange={() =>
										setForm((prev) => ({
											...prev,
											productType: TYPE_PRODUCT.DUNG_CHUNG,
										}))
									}
								/>
								<label htmlFor='dung_chung'>Dùng chung</label>
							</div>
						</div>
					</div>
				</div>
				<div className={clsx('mt', 'col_2')}>
					<Input
						name='name'
						value={form.name || ''}
						isRequired
						max={255}
						type='text'
						blur={true}
						placeholder='Nhập tên loại hàng'
						label={
							<span>
								Tên loại hàng<span style={{color: 'red'}}> *</span>
							</span>
						}
					/>
					<div>
						<Input
							name='fullName'
							value={form.fullName || ''}
							isRequired
							max={255}
							type='text'
							blur={true}
							placeholder='Nhập tên đẩy đủ loại hàng'
							label={
								<span>
									Tên đầy đủ loại hàng<span style={{color: 'red'}}> *</span>
								</span>
							}
						/>
					</div>
				</div>

				<div className={clsx('mt', 'col_2')}>
					<Input
						name='normalName'
						value={form.normalName || ''}
						isRequired
						max={255}
						type='text'
						blur={true}
						placeholder='Nhập tên thường gọi loại hàng'
						label={
							<span>
								Tên thường gọi loại hàng<span style={{color: 'red'}}> *</span>
							</span>
						}
					/>
					<div>
						<Input
							name='scientificName'
							value={form.scientificName || ''}
							isRequired
							max={255}
							type='text'
							blur={true}
							placeholder='Nhập tên khoa học loại hàng'
							label={
								<span>
									Tên khoa học loại hàng<span style={{color: 'red'}}> *</span>
								</span>
							}
						/>
					</div>
				</div>
				<div className={clsx('mt', 'col_2')}>
					<InputColor
						label={
							<span>
								Màu hiển thị <span style={{color: 'red'}}>*</span>
							</span>
						}
						color={form.colorShow}
						onSetColor={(color) =>
							setForm((prev) => ({
								...prev,
								colorShow: color,
							}))
						}
					/>
					<div>
						<Input
							name='speciesGroup'
							value={form.speciesGroup || ''}
							isRequired
							max={255}
							type='text'
							blur={true}
							placeholder='Nhập nhóm loại hàng'
							label={
								<span>
									Nhóm loại hàng<span style={{color: 'red'}}> *</span>
								</span>
							}
						/>
					</div>
				</div>
				<div className={clsx('mt')}>
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

				<div className={clsx('mt')}>
					<TextArea placeholder='Thêm mô tả' name='description' label={<span>Mô tả</span>} blur max={5000} />
				</div>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<div>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 rounded_2 primary>
									Lưu lại
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose />
				</div>
			</Form>
		</div>
	);
}

export default FormUpdateProductType;

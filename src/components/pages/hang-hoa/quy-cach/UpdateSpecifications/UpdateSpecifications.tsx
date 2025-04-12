import React, {useState} from 'react';
import {IFormUpdateSpecifications, PropsUpdateSpecifications} from './interfaces';
import styles from './UpdateSpecifications.module.scss';
import Button from '~/components/common/Button';
import {PATH} from '~/constants/config';
import Form, {FormContext, Input} from '~/components/common/Form';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_RULER} from '~/constants/config/enum';
import TextArea from '~/components/common/Form/components/TextArea';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import {useRouter} from 'next/router';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import InputColor from '~/components/common/InputColor';
import ItemRuler from '../ItemRuler';

function UpdateSpecifications({}: PropsUpdateSpecifications) {
	const router = useRouter();

	const {_id} = router.query;

	const [form, setForm] = useState<IFormUpdateSpecifications>({
		uuid: '',
		name: '',
		qualityUuid: '',
		productTypeUuid: '',
		description: '',
		colorShow: '',
	});

	const [dataRuler, setDataRuler] = useState<
		{
			uuid: string;
			titleType: string;
			rule: TYPE_RULER;
			value: number;
			order: string | number;
		}[]
	>([
		{
			uuid: '',
			titleType: '',
			rule: TYPE_RULER.NHO_HON,
			value: 0,
			order: '',
		},
	]);

	useQuery([QUERY_KEY.chi_tiet_quy_cach, _id], {
		queryFn: () =>
			httpRequest({
				http: wareServices.getDetailSpecifications({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					uuid: data?.uuid || '',
					name: data?.name || '',
					qualityUuid: data?.qualityUu?.uuid || '',
					productTypeUuid: data?.productTypeUu?.uuid || '',
					description: data?.description || '',
					colorShow: data?.colorShow || '',
				});
				setDataRuler(
					data?.criteriaUu?.map((v: any) => ({
						uuid: v?.uuid,
						titleType: v?.title,
						rule: v?.ruler,
						value: v?.value,
						order: v?.order,
					}))
				);
			}
		},
		enabled: !!_id,
	});

	const listQualities = useQuery([QUERY_KEY.dropdown_quoc_gia], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listQuality({
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

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_go], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					type: [],
				}),
			}),
		select(data) {
			return data;
		},
	});

	const handleAddRow = () => {
		setDataRuler((prev) => [
			...prev,
			{
				uuid: '',
				titleType: '',
				rule: TYPE_RULER.NHO_HON,
				value: 0,
				order: '',
			},
		]);
	};

	const handleDeleteRow = (index: number) => {
		if (dataRuler.length > 1) {
			const updateData = [...dataRuler];
			updateData.splice(index, 1);
			setDataRuler([...updateData]);
		} else {
			setDataRuler([
				{
					uuid: '',
					titleType: '',
					rule: TYPE_RULER.NHO_HON,
					value: 0,
					order: '',
				},
			]);
		}
	};

	const handleChangeValue = (index: number, name: string, value: any) => {
		const newData = [...dataRuler];

		newData[index] = {
			...newData[index],
			[name]: value,
		};

		setDataRuler(newData);
	};

	const handleChangeValueSelectSearch = (index: number, updates: {[key: string]: any}) => {
		const newData = [...dataRuler];
		newData[index] = {
			...newData[index],
			...updates,
		};
		setDataRuler(newData);
	};

	const funcUpdateSpecifications = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa quy cách thành công!',
				http: wareServices.upsertSpecifications({
					uuid: form.uuid,
					name: form.name,
					description: form.description,
					qualityUuid: form.qualityUuid,
					productTypeUuid: form.productTypeUuid,
					colorShow: form.colorShow,
					items: dataRuler?.map((v) => ({
						...v,
						order: Number(v?.order),
						value: Number(v?.value),
					})),
				}),
			}),
		onSuccess(data) {
			if (data) {
				router.replace(PATH.HangHoaQuyCach, undefined, {
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
		if (!form?.qualityUuid) {
			return toastWarn({
				msg: 'Vui lòng chọn quốc gia!',
			});
		}

		if (dataRuler?.some((v) => v.titleType == '')) {
			return toastWarn({
				msg: 'Vui lòng nhập tiêu chí!',
			});
		}

		if (dataRuler?.some((v) => !v.value)) {
			return toastWarn({
				msg: 'Vui lòng nhập thông số!',
			});
		}
		if (!form?.colorShow) {
			return toastWarn({msg: 'Vui lòng chọn màu!'});
		}

		const orderList = dataRuler.map((v) => v.order);
		const hasDuplicateOrder = orderList.some((order, index) => orderList.indexOf(order) !== index);
		if (hasDuplicateOrder) {
			return toastWarn({msg: 'Số thứ tự bị trùng, vui lòng kiểm tra lại!'});
		}

		return funcUpdateSpecifications.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateSpecifications.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Chỉnh sửa quy cách</h4>
						<p>Điền đầy đủ các thông tin quy cách</p>
					</div>
					<div className={styles.right}>
						<Button href={PATH.HangHoaQuyCach} p_10_24 rounded_2 grey_outline>
							Hủy bỏ
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 rounded_2 primary>
									Cập nhật
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</div>
				<div className={styles.form}>
					<div className='mt'>
						<Input
							name='name'
							value={form.name || ''}
							isRequired
							// readOnly={true}
							max={255}
							type='text'
							blur={true}
							placeholder='Nhập tên'
							label={
								<span>
									Tên quy cách<span style={{color: 'red'}}>*</span>
								</span>
							}
						/>
					</div>
					<div className={clsx('mt', styles.grid)}>
						<div>
							<Select
								isSearch
								name='qualityUuid'
								value={form.qualityUuid}
								readOnly={true}
								placeholder='Lựa chọn'
								onChange={(e) =>
									setForm((prev: any) => ({
										...prev,
										qualityUuid: e.target.value,
									}))
								}
								label={
									<span>
										Quốc gia <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listQualities?.data?.map((v: any) => (
									<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
								))}
							</Select>
						</div>
						<Select
							isSearch
							name='productTypeUuid'
							value={form.productTypeUuid}
							readOnly={true}
							placeholder='Lựa chọn'
							onChange={(e) =>
								setForm((prev: any) => ({
									...prev,
									productTypeUuid: e.target.value,
								}))
							}
							label={
								<span>
									Loại hàng <span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listProductType?.data?.map((v: any) => (
								<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
							))}
						</Select>
						<InputColor
							label={
								<span>
									Màu hiển thị<span style={{color: 'red'}}>*</span>
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
					</div>

					<div className={clsx('mt')}>
						<TextArea placeholder='Chỉnh sửa mô tả' name='description' label={<span>Mô tả</span>} blur max={5000} />
					</div>

					<div className={clsx('mt')}>
						<div className={styles.header_quantily}>
							<p>
								Tiêu chí <span style={{color: 'red'}}>*</span>
							</p>
							<p>
								Điều kiện <span style={{color: 'red'}}>*</span>
							</p>
							<p>
								Thông số <span style={{color: 'red'}}>*</span>
							</p>
							<p>
								Thứ tự <span style={{color: 'red'}}>*</span>
							</p>
						</div>
						{dataRuler?.map((v, idx) => (
							<ItemRuler
								key={idx}
								data={v}
								idx={idx}
								showBtnDelete={true}
								handleDeleteRow={handleDeleteRow}
								handleChangeValue={handleChangeValue}
								handleChangeValueSelectSearch={handleChangeValueSelectSearch}
							/>
						))}
					</div>

					<div className={clsx('mt')}>
						<p className={styles.btn_add} onClick={handleAddRow}>
							<span style={{fontSize: 20}}>+</span> Chỉnh sửa tiêu chí
						</p>
					</div>
				</div>
			</Form>
		</div>
	);
}

export default UpdateSpecifications;

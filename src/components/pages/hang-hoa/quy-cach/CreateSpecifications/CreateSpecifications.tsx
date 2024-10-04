import React, {useState} from 'react';
import {IFormCreateSpecifications, PropsCreateSpecifications} from './interfaces';
import styles from './CreateSpecifications.module.scss';
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

function CreateSpecifications({}: PropsCreateSpecifications) {
	const router = useRouter();

	const [form, setForm] = useState<IFormCreateSpecifications>({
		name: '',
		qualityUuid: '',
		productTypeUuid: '',
		description: '',
		colorShow: '#16DBCC',
	});

	const [dataRuler, setDataRuler] = useState<
		{
			uuid: string;
			titleType: string;
			rule: TYPE_RULER;
			value: number;
		}[]
	>([
		{
			uuid: '',
			titleType: '',
			rule: TYPE_RULER.NHO_HON,
			value: 0,
		},
	]);

	const listQualities = useQuery([QUERY_KEY.dropdown_quoc_gia], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listQuality({
					page: 1,
					pageSize: 20,
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
					pageSize: 20,
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

	const funcCreateSpecifications = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới quy cách thành công!',
				http: wareServices.upsertSpecifications({
					uuid: '',
					name: form.name,
					description: form.description,
					qualityUuid: form.qualityUuid,
					productTypeUuid: form.productTypeUuid,
					colorShow: form.colorShow,
					items: dataRuler?.map((v) => ({
						...v,
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

		return funcCreateSpecifications.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcCreateSpecifications.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Thêm quy cách</h4>
						<p>Điền đầy đủ các thông tin quy cách</p>
					</div>
					<div className={styles.right}>
						<Button href={PATH.HangHoaQuyCach} p_10_24 rounded_2 grey_outline>
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
					<div className='mt'>
						<Input
							name='name'
							value={form.name || ''}
							isRequired
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
						<TextArea placeholder='Thêm mô tả' name='description' label={<span>Mô tả</span>} blur max={5000} />
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
						</div>
						{dataRuler?.map((v, idx) => (
							<ItemRuler
								key={idx}
								data={v}
								idx={idx}
								showBtnDelete={idx != 0}
								handleDeleteRow={handleDeleteRow}
								handleChangeValue={handleChangeValue}
								handleChangeValueSelectSearch={handleChangeValueSelectSearch}
							/>
						))}
					</div>

					<div className={clsx('mt')}>
						<p className={styles.btn_add} onClick={handleAddRow}>
							<span style={{fontSize: 20}}>+</span> Thêm tiêu chí
						</p>
					</div>
				</div>
			</Form>
		</div>
	);
}

export default CreateSpecifications;

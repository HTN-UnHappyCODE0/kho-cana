import React, {useEffect, useState} from 'react';

import {PropsBoxUpdateSpec} from './interfaces';
import styles from './BoxUpdateSpec.module.scss';
import Button from '~/components/common/Button';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import weightSessionServices from '~/services/weightSessionServices';
import {httpRequest} from '~/services';
import {QUERY_KEY} from '~/constants/config/enum';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';

function BoxUpdateSpec({dataUpdateSpec, onClose}: PropsBoxUpdateSpec) {
	const queryClient = useQueryClient();

	const [dataRules, setDataRules] = useState<
		{
			uuid: string;
			title: string;
			value: number;
		}[]
	>([]);

	useEffect(() => {
		setDataRules(
			dataUpdateSpec?.specStyleUu?.map((v) => ({
				uuid: v?.criteriaUu?.uuid!,
				title: v?.criteriaUu?.title!,
				value: v?.value!,
			}))!
		);
	}, [dataUpdateSpec]);

	const handleChange = (rule: {uuid: string; title: string; value: number}, value: any) => {
		setDataRules((prevRules) =>
			prevRules.map((r) =>
				r.uuid === rule.uuid
					? {
							...r,
							value: value,
					  }
					: r
			)
		);
	};

	const fucnUpdateSpecWeightSession = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật quy cách thành công!',
				http: weightSessionServices.updateSpecWeightSession({
					wsUuids: [dataUpdateSpec?.uuid!],
					lstValueSpec: dataRules?.map((v) => ({
						uuid: v?.uuid,
						value: Number(v?.value),
					})),
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_nhap_lieu_do_kho]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		if (dataRules?.some((v) => isNaN(v?.value))) {
			return toastWarn({msg: 'Nhập giá trị cho tiêu chí quy cách!'});
		}

		return fucnUpdateSpecWeightSession.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnUpdateSpecWeightSession.isLoading} />
			<div className={styles.main}>
				{dataRules?.map((v, i) => (
					<div key={i} className={styles.item}>
						<p>{v?.title}</p>
						<input
							className={styles.input}
							type='number'
							step='0.01'
							value={v?.value}
							onChange={(e) => handleChange(v, e.target.value)}
						/>
					</div>
				))}
			</div>

			<div className={styles.box_btn}>
				<div className={styles.btn}>
					<Button p_8_24 rounded_2 primary onClick={handleSubmit}>
						Xác nhận
					</Button>
				</div>
			</div>
		</div>
	);
}

export default BoxUpdateSpec;

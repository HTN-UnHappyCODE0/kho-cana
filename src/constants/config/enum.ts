export enum QUERY_KEY {
	dropdown_loai_go,
	dropdown_khach_hang,
	dropdown_kho_hang,
	dropdown_kho_hang_den,
	dropdown_kho_hang_nguon,
	dropdown_bai,
	dropdown_bai_nguon,
	dropdown_bai_dich,
	dropdown_xe_hang,
	dropdown_quy_cach,
	dropdown_loai_go_quy_cach,
	dropdown_khach_hang_nhap,
	dropdown_nha_cung_cap_xuat,
	dropdown_lo_hang,
	dropdown_RFID,
	dropdown_chuc_vu,
	dropdown_quan_ly_xe,
	dropdown_tram_can,
	dropdown_ban_can,
	dropdown_cong_ty,
	dropdown_tinh_thanh_pho,
	dropdown_quan_huyen,
	dropdown_xa_phuong,
	dropdown_quoc_gia,
	dropdown_tieu_chi_quy_cach,
	dropdown_nha_cung_cap,
	dropdown_loai_hang,
	dropdown_chat_luong,
	dropdown_gia_tien_hang,
	dropdown_khach_hang_xuat,
	dropdown_ma_lo_hang,
	dropdown_tau_hang,
	dropdown_tinh_thanh_pho_quan_ly,
	dropdown_nguoi_quan_ly_nhan_vien,
	dropdown_nhan_vien_thi_truong,
	dropdown_ma_tau,

	table_xe_hang,
	table_lenh_can_tat_ca,
	table_lenh_can_nhap,
	table_lenh_can_xuat,
	table_lenh_can_dich_vu,
	table_lenh_can_chuyen_kho,
	table_lenh_can_xuat_thang,
	table_luot_can_tat_ca,
	table_luot_can_phieu_nhap,
	table_luot_can_phieu_xuat,
	table_luot_can_phieu_dich_vu,
	table_luot_can_phieu_xuat_thang,
	table_luot_can_phieu_chuyen_kho,
	table_luot_can_nhom_theo_xe,
	table_phieu_can_tat_ca,
	table_phieu_can_nhap,
	table_phieu_can_xuat,
	table_phieu_can_dich_vu,
	table_phieu_can_chuyen_kho,
	table_phieu_can_xuat_thang,
	table_RFID,
	table_ban_can,
	table_tram_can,
	table_loai_go,
	table_quoc_gia,
	table_quy_cach,
	table_nha_cung_cap,
	table_bai,
	table_lich_su_bai,
	table_khach_hang_bai,
	table_kiem_ke_bai,
	table_kho_hang,
	table_khach_hang_dich_vu,
	table_hang_hoa_cua_khach_hang,
	table_hang_hoa_cua_nha_cung_cap,
	table_khach_hang_xuat,
	table_ktk_duyet_san_luong,
	table_qlk_duyet_phieu,
	table_cang_boc_do,
	table_tau,
	table_nhap_lieu_quy_cach,
	table_nhap_lieu_do_kho,
	table_phieu_da_gui_KT,
	table_chi_tiet_don_hang_phieu,
	table_chi_tiet_xe_hang_phieu_can,

	chi_tiet_lenh_can,
	chi_tiet_phieu_can,
	chi_tiet_bai,
	chi_tiet_bai_den,
	chi_tiet_bai_dich,
	chi_tiet_xe_hang,
	chi_tiet_tram_can,
	chi_tiet_quy_cach,
	chi_tiet_kho_hang,
	chi_tiet_lich_su_kiem_ke,
	chi_tiet_khach_hang,
	chi_tiet_nha_cung_cap,
	chi_tiet_tau,
	chi_tiet_nhan_vien,

	thong_ke_kho_hang,
	danh_sach_tieu_chi_nha_lieu,
}

export enum TYPE_DATE {
	ALL = -1,
	TODAY = 1,
	YESTERDAY = 2,
	THIS_WEEK = 3,
	LAST_WEEK = 4,
	THIS_MONTH = 5,
	LAST_MONTH = 6,
	THIS_YEAR = 7,
	LAST_7_DAYS = 8,
	LUA_CHON = 9,
}

export enum GENDER {
	NAM,
	NU,
	KHAC,
}

export enum CONDITION {
	BIG,
	SMALL,
}

export enum CONFIG_STATUS {
	BI_KHOA,
	HOAT_DONG,
}

export enum CONFIG_PAGING {
	NO_PAGING,
	IS_PAGING,
}

export enum CONFIG_DESCENDING {
	NO_DESCENDING,
	IS_DESCENDING,
}

export enum CONFIG_TYPE_FIND {
	DROPDOWN,
	FILTER,
	TABLE,
}

export enum TYPE_TRANSPORT {
	DUONG_BO,
	DUONG_THUY,
}

export enum STATUS_BILL {
	DA_HUY,
	CHUA_CAN,
	DANG_CAN,
	TAM_DUNG,
	DA_CAN_CHUA_KCS,
	DA_KCS,
	CHOT_KE_TOAN,
}

export enum STATE_BILL {
	NOT_CHECK = 0,
	QLK_REJECTED,
	QLK_CHECKED,
	KTK_REJECTED,
	KTK_CHECKED,
	END,
}

export enum STATUS_WEIGHT_SESSION {
	DA_HUY,
	CAN_LAN_1,
	CAN_LAN_2,
	UPDATE_SPEC_DONE,
	UPDATE_DRY_DONE,
	KCS_XONG,
	CHOT_KE_TOAN,
}

export enum STATUS_CUSTOMER {
	DA_XOA = -1,
	DUNG_HOP_TAC = 0,
	HOP_TAC = 1,
}

export enum TYPE_CUSTOMER {
	NHA_CUNG_CAP = 1,
	KH_XUAT,
	DICH_VU,
}

export enum TYPE_SIFT {
	KHONG_CAN_SANG,
	CAN_SANG,
}

export enum STATUS_DEBT {
	THANH_TOAN,
	TAM_UNG,
}

export enum STATUS_STANDARD {
	DANG_AP_DUNG,
	NGUNG_AP_DUNG,
}

export enum OWNEW_TYPE_TRUCK {
	XE_KHACH_HANG,
	XE_CONG_TY,
}

export enum CONFIG_STATE_SPEC_CUSTOMER {
	CHUA_CUNG_CAP,
	DANG_CUNG_CAP,
}

export enum CONFIG_PRINT {
	NOT_PRINT,
	IS_PRINT,
}

export enum TYPE_BATCH {
	CAN_LE,
	CAN_LO,
}

export enum TYPE_SCALES {
	CAN_NHAP = 1,
	CAN_XUAT,
	CAN_DICH_VU,
	CAN_CHUYEN_KHO,
	CAN_TRUC_TIEP,
}

export enum TYPE_PRODUCT {
	CONG_TY = 1,
	DICH_VU,
	DUNG_CHUNG,
}

export enum TYPE_RULER {
	NHO_HON,
	LON_HON,
}

export enum TYPE_PARTNER {
	NCC = 1,
	KH_XUAT,
	KH_DICH_VU,
}

export enum REGENCY_NAME {
	'Nhân viên tài chính - kế toán' = '9',
	'Nhân viên KCS' = '8',
	'Nhân viên thị trường' = '7',
	'Nhân viên cân' = '6',
	'Quản lý xe' = '5',
	'Quản lý nhập hàng' = '4',
	'Quản lý kho KCS' = '3',
	'Phó Giám Đốc' = '2',
	'Giám Đốc' = '1',
}

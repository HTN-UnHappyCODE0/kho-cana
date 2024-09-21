import icons from '../images/icons';
import {TYPE_DATE} from './enum';

export const MAXIMUM_FILE = 10; //MB

export const allowFiles = [
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'image/jpeg',
	'image/jpg',
	'image/png',
];

export enum PATH {
	Any = 'any',
	Login = '/auth/login',
	ForgotPassword = '/auth/forgot-password',
	Home = '/',
	QuanLyXe = '/xe-hang',
	QuanLyTau = '/tau',

	RFID = '/rfid',

	QuanLyCan = '/quan-ly-can',
	TramCan = '/quan-ly-can/tram-can',
	CauCan = '/quan-ly-can/cau-can',
	ThemTramCan = '/quan-ly-can/tram-can/them-moi',

	QuanLyKhachHang = '/khach-hang',
	ThemKhachHang = '/khach-hang/them-moi',

	HangHoa = '/hang-hoa',
	HangHoaLoaiGo = '/hang-hoa/loai-go',
	HangHoaQuocGia = '/hang-hoa/quoc-gia',
	HangHoaQuyCach = '/hang-hoa/quy-cach',
	ThemQuyCach = '/hang-hoa/quy-cach/them-moi',

	PhieuDuKien = '/lenh-can',
	PhieuDuKienTatCa = '/lenh-can/tat-ca',
	PhieuDuKienNhap = '/lenh-can/phieu-nhap',
	PhieuDuKienXuat = '/lenh-can/phieu-xuat',
	PhieuDuKienDichVu = '/lenh-can/dich-vu',
	PhieuDuKienChuyenKho = '/lenh-can/chuyen-kho',
	PhieuDuKienXuatThang = '/lenh-can/phieu-xuat-thang',

	PhieuCan = '/phieu-can',
	PhieuCanTatCa = '/phieu-can/tat-ca',
	PhieuCanNhap = '/phieu-can/phieu-nhap',
	PhieuCanXuat = '/phieu-can/phieu-xuat',
	PhieuCanDichVu = '/phieu-can/dich-vu',
	PhieuCanChuyenKho = '/phieu-can/chuyen-kho',
	PhieuCanXuatThang = '/phieu-can/xuat-thang',

	NhapLieu = '/nhap-lieu',
	NhapLieuQuyCach = '/nhap-lieu/quy-cach',
	NhapLieuDoKho = '/nhap-lieu/do-kho',
	NhapLieuPhieuDaGui = '/nhap-lieu/phieu-da-gui',

	// Nhà cung cấp
	NhaCungCap = '/nha-cung-cap',
	ThemMoiNhaCungCap = '/nha-cung-cap/them-moi',
	ChinhSuaNhaCungCap = '/nha-cung-cap/chinh-sua',

	// Khách hàng xuất
	KhachHangXuat = '/khach-hang-xuat',
	ThemMoiKhachHangXuat = '/khach-hang-xuat/them-moi/',
	ChinhSuaKhachHangXuat = '/khach-hang-xuat/chinh-sua/',

	//Khách hàng dịch vụ
	KhachHangDichVu = '/khach-hang-dich-vu',
	ThemMoiKhachHangDichVu = '/khach-hang-dich-vu/them-moi/',
	ChinhSuaKhachHangDichVu = '/khach-hang-dich-vu/chinh-sua/',

	Profile = '/profile',

	LuotCan = '/luot-can',
	LuotCanTatCa = '/luot-can/tat-ca',
	LuotCanNhap = '/luot-can/phieu-nhap',
	LuotCanXuat = '/luot-can/phieu-xuat',
	LuotCanDichVu = '/luot-can/dich-vu',
	LuotCanChuyenKho = '/luot-can/chuyen-kho',
	LuotCanXuatThang = '/luot-can/xuat-thang',
	LuotCanGomTheoXe = '/luot-can/gom-theo-xe',

	DuyetSanLuong = '/duyet-san-luong',
}

export const Menu: {
	title: string;
	group: {
		path: string;
		pathActive?: string;
		title: string;
		icon: any;
	}[];
}[] = [
	{
		title: 'Kho hàng',
		group: [
			{title: 'Kho hàng', icon: icons.danhsachkho, path: PATH.Home, pathActive: '/kho-hang'},
			{title: 'Hàng hóa', icon: icons.hanghoa, path: PATH.HangHoaLoaiGo, pathActive: PATH.HangHoa},
			{title: 'RFID', icon: icons.icon_rfid, path: PATH.RFID, pathActive: PATH.RFID},
			{title: 'Quản lý xe', icon: icons.xehang, path: PATH.QuanLyXe},
			{title: 'Quản lý tàu', icon: icons.icon_ship, path: PATH.QuanLyTau},
			{title: 'Trạm cân', icon: icons.tramcan, path: PATH.TramCan, pathActive: PATH.QuanLyCan},
		],
	},
	{
		title: 'Công ty',
		group: [
			{title: 'Nhà cung cấp', icon: icons.xuong, path: PATH.NhaCungCap},
			{title: 'Khách hàng xuất', icon: icons.khachhangxuat, path: PATH.KhachHangXuat},
			{title: 'Khách hàng dịch vụ ', icon: icons.khachhangdichvu, path: PATH.KhachHangDichVu},
		],
	},
	{
		title: 'Quản lý cân',
		group: [
			{title: 'Lệnh cân', icon: icons.phieudukien, path: PATH.PhieuDuKienTatCa, pathActive: PATH.PhieuDuKien},
			{title: 'Phiếu cân', icon: icons.phieudacan, path: PATH.PhieuCanTatCa, pathActive: PATH.PhieuCan},
			{title: 'Lượt cân', icon: icons.luotcan, path: PATH.LuotCanTatCa, pathActive: PATH.LuotCan},
			{title: 'Nhập liệu', icon: icons.nhaplieu, path: PATH.NhapLieuQuyCach, pathActive: PATH.NhapLieu},
		],
	},
	{
		title: 'Kế toán kho',
		group: [{title: 'Duyệt sản lượng', icon: icons.duyetsanluong, path: PATH.DuyetSanLuong, pathActive: PATH.DuyetSanLuong}],
	},
];

export const KEY_STORE = 'KHO-HANG-TRAM-CAN';

export const ListOptionTimePicker: {
	name: string;
	value: number;
}[] = [
	{
		name: 'Hôm nay',
		value: TYPE_DATE.TODAY,
	},
	{
		name: 'Hôm qua',
		value: TYPE_DATE.YESTERDAY,
	},
	{
		name: 'Tuần này',
		value: TYPE_DATE.THIS_WEEK,
	},
	{
		name: 'Tuần trước',
		value: TYPE_DATE.LAST_WEEK,
	},
	{
		name: '7 ngày trước',
		value: TYPE_DATE.LAST_7_DAYS,
	},
	{
		name: 'Tháng này',
		value: TYPE_DATE.THIS_MONTH,
	},
	// {
	// 	name: 'Tháng trước',
	// 	value: TYPE_DATE.LAST_MONTH,
	// },
	// {
	// 	name: 'Năm này',
	// 	value: TYPE_DATE.THIS_YEAR,
	// },
	{
		name: 'Lựa chọn',
		value: TYPE_DATE.LUA_CHON,
	},
];

export const WEIGHT_WAREHOUSE = 10000; // Tấn

const dinhDang = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh',
})

export default function dinhDangGioHen(gioHen) {
  return dinhDang.format(new Date(gioHen))
}

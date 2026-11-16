export default function LienHeTinDang({ tin }) {
  if (!tin.coTheLienHe) {
    return <p className="mt-4 text-sm leading-6 text-amber-700">Chỉ người có yêu cầu nhận đồ đã được duyệt mới xem được thông tin liên hệ.</p>
  }

  const cacTruong = [
    ['Số điện thoại', tin.contactPhone],
    ['Email / Gmail', tin.contactEmail],
  ]

  return (
    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
      {cacTruong.map(([nhan, giaTri]) => (
        <div key={nhan} className="space-y-1 rounded-xl bg-[#f7faf8] p-4 text-sm">
          <dt className="text-[#718276]">{nhan}</dt>
          <dd className="break-words font-medium text-[#315a43]">{giaTri || 'Không cung cấp'}</dd>
        </div>
      ))}
    </dl>
  )
}

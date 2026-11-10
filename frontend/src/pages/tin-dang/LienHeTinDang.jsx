export default function LienHeTinDang({ tin }) {
  if (!tin.coTheLienHe) {
    return <p className="mt-4 text-sm leading-6 text-[#607568]">Thông tin liên hệ sẽ hiển thị khi yêu cầu nhận đồ của bạn được duyệt.</p>
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

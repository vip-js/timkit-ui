import Image from 'next/image'
import { PlusIcon } from '@heroicons/react/20/solid'
import { Button } from '@timui/react'

const members = [
  {
    avatar: 'https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg',
    name: 'John lorin',
    email: 'john@example.com',
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    name: 'Chris bondi',
    email: 'chridbondi@example.com',
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1464863979621-258859e62245?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    name: 'yasmine',
    email: 'yasmine@example.com',
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f',
    name: 'Joseph',
    email: 'joseph@example.com',
  },
]

const PreviewCard = () => (
  <div className="mx-auto hidden max-w-lg flex-1 rounded-2xl bg-[#18181B]/75 p-6 md:block">
    <div className="items-start justify-between sm:flex">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">团队成员</h3>
        <p className="mt-2 max-w-xs text-sm text-zinc-300">为团队成员提供系统管理权限。</p>
      </div>
      <Button className="flex flex-none items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white hover:bg-indigo-500 active:bg-indigo-700">
        <PlusIcon className="h-5 w-5" />
        添加成员
      </Button>
    </div>
    <ul className="mt-12 divide-y divide-zinc-800">
      {members.map((item, idx) => (
        <li key={idx} className="py-5">
          <div className="flex gap-3">
            <Image
              src={item.avatar}
              className="h-12 w-12 flex-none rounded-full"
              width={48}
              height={48}
              alt=""
            />
            <div className="text-sm">
              <span className="block font-semibold text-zinc-100">{item.name}</span>
              <span className="mt-2 block text-zinc-400">{item.email}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
)

export default PreviewCard

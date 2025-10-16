import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, MessageCircle, AlertTriangle } from 'lucide-react'

interface QRModalProps {
  isOpen: boolean
  onClose: () => void
}

export const QRModal = ({ isOpen, onClose }: QRModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 text-orange-500 mr-2" />
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      使用次数不足
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-6">
                    您的工具使用次数已用完，请扫描下方微信二维码联系管理员获取更多使用次数。
                  </p>

                  <div className="flex flex-col items-center space-y-4">
                    {/* 微信二维码占位符 - 可以替换为实际的二维码图片 */}
                    <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                      <MessageCircle className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center">
                        微信二维码
                      </p>
                      <p className="text-xs text-gray-400 text-center mt-1">
                        管理员微信
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        联系管理员获取更多使用次数
                      </p>
                      <p className="text-xs text-gray-500">
                        扫描二维码添加管理员微信
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <MessageCircle className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-800">
                          <strong>提示：</strong>
                          联系管理员时请说明您的账号邮箱，以便快速处理您的请求。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    我知道了
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
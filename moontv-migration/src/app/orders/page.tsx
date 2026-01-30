'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import type { PaymentOrder } from '@/lib/types';

interface OrderWithPlan extends PaymentOrder {
  plan_name?: string;
  plan_duration?: number;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/user/orders');
      const data = await response.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('获取订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: '待审核',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
        };
      case 'approved':
        return {
          icon: CheckCircle,
          text: '已通过',
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: '已拒绝',
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
        };
      case 'expired':
        return {
          icon: AlertCircle,
          text: '已过期',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
        };
      default:
        return {
          icon: Clock,
          text: status,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        {/* 返回按钮 */}
        <button
          onClick={() => router.push('/')}
          className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition'
        >
          <ArrowLeft className='w-5 h-5' />
          返回首页
        </button>

        {/* 页面标题 */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            我的订单
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            查看所有订单状态和详情
          </p>
        </div>

        {/* 订单列表 */}
        {orders.length === 0 ? (
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center'>
            <AlertCircle className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-600 dark:text-gray-400 mb-6'>
              您还没有任何订单
            </p>
            <button
              onClick={() => router.push('/vip')}
              className='px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition'
            >
              立即购买会员
            </button>
          </div>
        ) : (
          <div className='space-y-4'>
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.payment_status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order.order_no}
                  className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden'
                >
                  <div className='p-6'>
                    {/* 订单头部 */}
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                            {order.plan_name || '订阅套餐'}
                          </h3>
                          <div
                            className={`flex items-center gap-1 px-3 py-1 rounded-full border ${statusConfig.bgColor} ${statusConfig.borderColor}`}
                          >
                            <StatusIcon
                              className={`w-4 h-4 ${statusConfig.color}`}
                            />
                            <span
                              className={`text-sm font-medium ${statusConfig.color}`}
                            >
                              {statusConfig.text}
                            </span>
                          </div>
                        </div>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          订单号: {order.order_no}
                        </p>
                      </div>
                      <div className='text-right'>
                        <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                          ¥{order.amount}
                        </div>
                      </div>
                    </div>

                    {/* 订单详情 */}
                    <div className='grid grid-cols-2 gap-4 text-sm mb-4'>
                      <div>
                        <span className='text-gray-500 dark:text-gray-400'>
                          创建时间：
                        </span>
                        <span className='text-gray-900 dark:text-white'>
                          {order.created_at
                            ? new Date(order.created_at).toLocaleString('zh-CN')
                            : '-'}
                        </span>
                      </div>
                      {order.plan_duration && (
                        <div>
                          <span className='text-gray-500 dark:text-gray-400'>
                            套餐时长：
                          </span>
                          <span className='text-gray-900 dark:text-white'>
                            {order.plan_duration} 天
                          </span>
                        </div>
                      )}
                      {order.verified_at && (
                        <div>
                          <span className='text-gray-500 dark:text-gray-400'>
                            审核时间：
                          </span>
                          <span className='text-gray-900 dark:text-white'>
                            {new Date(order.verified_at).toLocaleString(
                              'zh-CN'
                            )}
                          </span>
                        </div>
                      )}
                      {order.expires_at &&
                        order.payment_status === 'pending' && (
                          <div>
                            <span className='text-gray-500 dark:text-gray-400'>
                              过期时间：
                            </span>
                            <span className='text-gray-900 dark:text-white'>
                              {new Date(order.expires_at).toLocaleString(
                                'zh-CN'
                              )}
                            </span>
                          </div>
                        )}
                    </div>

                    {/* 拒绝原因 */}
                    {order.payment_status === 'rejected' &&
                      order.reject_reason && (
                        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
                          <p className='text-sm font-medium text-red-800 dark:text-red-200 mb-1'>
                            拒绝原因：
                          </p>
                          <p className='text-sm text-red-700 dark:text-red-300'>
                            {order.reject_reason}
                          </p>
                        </div>
                      )}

                    {/* 支付凭证预览 */}
                    {order.payment_proof && (
                      <div className='mt-4'>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                          支付凭证：
                        </p>
                        <img
                          src={order.payment_proof}
                          alt='支付凭证'
                          className='max-w-xs rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90'
                          onClick={() =>
                            window.open(order.payment_proof, '_blank')
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 底部提示 */}
        {orders.length > 0 && (
          <div className='mt-8 text-center'>
            <button
              onClick={() => router.push('/vip')}
              className='text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium'
            >
              继续购买会员 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

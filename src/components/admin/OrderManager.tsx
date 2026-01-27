'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { PaymentOrder } from '@/lib/types';
import { CheckCircle, Clock, XCircle, Eye, Image as ImageIcon } from 'lucide-react';

export default function OrderManager() {
    const [orders, setOrders] = useState<PaymentOrder[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [viewingProof, setViewingProof] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/orders?page=${page}&limit=20`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAudit = async (orderNo: string, status: 'approved' | 'rejected') => {
        try {
            const { isConfirmed, value: reason } = await Swal.fire({
                title: status === 'approved' ? '确认通过?' : '确认拒绝?',
                input: status === 'rejected' ? 'text' : undefined,
                inputPlaceholder: '请输入拒绝原因',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                confirmButtonColor: status === 'approved' ? '#16a34a' : '#dc2626',
            });

            if (!isConfirmed) return;

            const res = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderNo, status, reason }),
            });

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '操作成功',
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchOrders(); // refresh
            } else {
                throw new Error('Operation failed');
            }
        } catch (error) {
            Swal.fire('操作失败', '请重试', 'error');
        }
    };

    const handleRevoke = async (username: string) => {
        try {
            const { isConfirmed } = await Swal.fire({
                title: '确认停止观看?',
                text: '这将立即取消该用户的当前订阅，用户将无法继续观看会员内容。',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '确定停止',
                cancelButtonText: '取消',
                confirmButtonColor: '#dc2626',
            });

            if (!isConfirmed) return;

            const res = await fetch('/api/admin/users/revoke-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '操作成功',
                    text: data.message,
                    timer: 1500,
                    showConfirmButton: false
                });
                // Optional: refresh orders or status
            } else {
                Swal.fire('操作失败', data.error || '未知错误', 'error');
            }
        } catch (error) {
            Swal.fire('操作失败', '请重试', 'error');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs"><CheckCircle size={12} /> 已通过</span>;
            case 'rejected':
                return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs"><XCircle size={12} /> 已拒绝</span>;
            case 'pending':
                return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded text-xs"><Clock size={12} /> 待审核</span>;
            default:
                return <span className="text-gray-500 bg-gray-50 px-2 py-0.5 rounded text-xs">{status}</span>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单号/用户</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">套餐/金额</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期限</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">凭证</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                        {orders.map((order) => (
                            <tr key={order.order_no}>
                                <td className="px-4 py-3">
                                    <div className="font-medium">{order.order_no}</div>
                                    <div className="text-gray-500 text-xs">{order.username}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-medium text-blue-600">{order.plan_name || `套餐ID: ${order.related_id}`}</div>
                                    <div className="font-bold">¥{order.amount}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-xs text-gray-500">
                                        {order.plan_duration ? `${order.plan_duration} 天` : '-'}
                                    </div>
                                    {order.payment_status === 'approved' && order.verified_at && order.plan_duration && (
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            到期: {new Date(new Date(order.verified_at).getTime() + order.plan_duration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {order.payment_proof ? (
                                        <button
                                            onClick={() => setViewingProof(order.payment_proof!)}
                                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <ImageIcon size={16} /> 查看
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 text-xs">未上传</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {getStatusBadge(order.payment_status)}
                                    {order.reject_reason && (
                                        <div className="text-xs text-red-500 mt-1">{order.reject_reason}</div>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500">
                                    {new Date(order.created_at || '').toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    {order.payment_status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAudit(order.order_no, 'approved')}
                                                className="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 border border-green-200 rounded"
                                            >
                                                通过
                                            </button>
                                            <button
                                                onClick={() => handleAudit(order.order_no, 'rejected')}
                                                className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 border border-red-200 rounded"
                                            >
                                                拒绝
                                            </button>
                                        </>
                                    )}
                                    {order.payment_status === 'approved' && order.order_type === 'subscription' && (
                                        <button
                                            onClick={() => handleRevoke(order.username!)}
                                            className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 border border-red-200 rounded"
                                            title="停止用户观看权限"
                                        >
                                            停止观看
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    暂无订单数据
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-2 mt-4">
                <button
                    disabled={page === 1 || loading}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    上一页
                </button>
                <span className="px-3 py-1">{page}</span>
                <button
                    disabled={orders.length < 20 || loading}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    下一页
                </button>
            </div>

            {viewingProof && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
                    onClick={() => setViewingProof(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={viewingProof}
                            alt="Payment Proof"
                            className="max-w-full max-h-[90vh] object-contain rounded"
                        />
                        <button
                            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { SubscriptionPlan } from '@/lib/types';
import { Edit2, Plus, Trash2 } from 'lucide-react';

export default function SubscriptionPlansManager() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [editingPlan, setEditingPlan] = useState<Partial<SubscriptionPlan> | null>(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/admin/plans');
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            }
        } catch (error) {
            console.error('Failed to fetch plans', error);
        }
    };

    const handleSave = async (plan: Partial<SubscriptionPlan>) => {
        try {
            // Parse features if string
            let featuresToSend = plan.features;
            if (typeof plan.features === 'string') {
                try {
                    JSON.parse(plan.features);
                } catch (e) {
                    // If not valid JSON, make it an array with one string
                    featuresToSend = JSON.stringify(plan.features.split('\n').filter(Boolean));
                }
            }

            const res = await fetch('/api/admin/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...plan,
                    features: featuresToSend
                }),
            });

            if (res.ok) {
                Swal.fire('保存成功', '', 'success');
                setEditingPlan(null);
                fetchPlans();
            } else {
                throw new Error('Save failed');
            }
        } catch (error) {
            Swal.fire('保存失败', '请重试', 'error');
        }
    };

    const openEditModal = (plan?: SubscriptionPlan) => {
        setEditingPlan(plan || {
            name: '',
            description: '',
            duration_days: 30,
            price: 0,
            original_price: 0,
            // @ts-expect-error features is json string but we treat as array in UI? No, let's keep it simple string in UI for now
            features: '[]',
            is_active: true,
            sort_order: 0
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => openEditModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    <Plus size={18} />
                    添加套餐
                </button>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <div key={plan.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={() => openEditModal(plan)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                <Edit2 size={16} />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{plan.name}</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-2xl font-bold text-blue-600">¥{plan.price}</span>
                            {plan.original_price && (
                                <span className="text-sm text-gray-400 line-through">¥{plan.original_price}</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{plan.description}</p>
                        <div className="text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">时长:</span> {plan.duration_days} 天
                        </div>
                        <div className="mt-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${plan.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {plan.is_active ? '已上架' : '已下架'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {editingPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                            {editingPlan.id ? '编辑套餐' : '添加套餐'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">套餐名称</label>
                                <input
                                    type="text"
                                    value={editingPlan.name}
                                    onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">价格</label>
                                    <input
                                        type="number"
                                        value={editingPlan.price}
                                        onChange={e => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">原价</label>
                                    <input
                                        type="number"
                                        value={editingPlan.original_price}
                                        onChange={e => setEditingPlan({ ...editingPlan, original_price: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">天数</label>
                                <input
                                    type="number"
                                    value={editingPlan.duration_days}
                                    onChange={e => setEditingPlan({ ...editingPlan, duration_days: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">描述</label>
                                <input
                                    type="text"
                                    value={editingPlan.description}
                                    onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">特权 (每行一个)</label>
                                <textarea
                                    value={(() => {
                                        if (!editingPlan.features) return '';
                                        try {
                                            const arr = JSON.parse(editingPlan.features);
                                            return Array.isArray(arr) ? arr.join('\n') : editingPlan.features;
                                        } catch (e) {
                                            return editingPlan.features;
                                        }
                                    })()}
                                    onChange={e => {
                                        const lines = e.target.value.split('\n');
                                        setEditingPlan({ ...editingPlan, features: JSON.stringify(lines) })
                                    }}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 h-24"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={editingPlan.is_active}
                                        onChange={e => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                                        className="rounded border-gray-300"
                                    />
                                    <span>上架销售</span>
                                </label>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm">排序</span>
                                    <input
                                        type="number"
                                        value={editingPlan.sort_order}
                                        onChange={e => setEditingPlan({ ...editingPlan, sort_order: Number(e.target.value) })}
                                        className="w-16 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setEditingPlan(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                取消
                            </button>
                            <button
                                onClick={() => handleSave(editingPlan)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

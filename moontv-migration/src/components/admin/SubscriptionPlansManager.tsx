'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { SubscriptionPlan } from '@/lib/types';
import { Edit2, Plus, Loader2 } from 'lucide-react';

export default function SubscriptionPlansManager() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [editingPlan, setEditingPlan] =
    useState<Partial<SubscriptionPlan> | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/plans', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      } else {
        throw new Error('Failed to fetch plans');
      }
    } catch (error) {
      console.error('Failed to fetch plans', error);
      Swal.fire('加载失败', '无法获取套餐列表', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validatePlan = (plan: Partial<SubscriptionPlan>): string | null => {
    if (!plan.name || plan.name.trim() === '') {
      return '套餐名称不能为空';
    }

    if (plan.name.trim().length > 50) {
      return '套餐名称不能超过50个字符';
    }

    if (typeof plan.price !== 'number' || plan.price < 0) {
      return '价格必须大于等于0';
    }

    if (plan.price > 999999) {
      return '价格不能超过999999';
    }

    if (typeof plan.duration_days !== 'number' || plan.duration_days <= 0) {
      return '天数必须大于0';
    }

    if (plan.duration_days > 3650) {
      return '天数不能超过3650天（10年）';
    }

    if (
      plan.original_price &&
      (typeof plan.original_price !== 'number' || plan.original_price < 0)
    ) {
      return '原价必须大于等于0';
    }

    if (plan.original_price && plan.original_price < plan.price) {
      return '原价必须大于等于现价';
    }

    if (plan.description && plan.description.length > 200) {
      return '描述不能超过200个字符';
    }

    return null;
  };

  const handleSave = async (plan: Partial<SubscriptionPlan>) => {
    // 数据校验
    const error = validatePlan(plan);
    if (error) {
      await Swal.fire('数据校验失败', error, 'error');
      return;
    }

    setSaving(true);
    try {
      // 处理特权字段
      let featuresToSend = plan.features;
      if (typeof plan.features === 'string') {
        try {
          // 尝试解析为 JSON
          JSON.parse(plan.features);
          // 如果成功，说明已经是有效 JSON
          featuresToSend = plan.features;
        } catch (e) {
          // 解析失败，将每行转换为数组
          const lines = plan.features
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean);
          featuresToSend = JSON.stringify(lines);
        }
      } else if (Array.isArray(plan.features)) {
        featuresToSend = JSON.stringify(plan.features);
      }

      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...plan,
          price: Number(plan.price),
          original_price: plan.original_price
            ? Number(plan.original_price)
            : undefined,
          duration_days: Number(plan.duration_days),
          sort_order: Number(plan.sort_order || 0),
          is_active: Boolean(plan.is_active), // 明确传递 is_active 字段
          features: featuresToSend,
        }),
      });

      if (res.ok) {
        await Swal.fire('保存成功', '', 'success');
        setEditingPlan(null);
        await fetchPlans();
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Save failed');
      }
    } catch (error: any) {
      await Swal.fire('保存失败', error.message || '请重试', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (plan?: SubscriptionPlan) => {
    if (plan) {
      // 编辑现有套餐
      setEditingPlan(plan);
    } else {
      // 新建套餐 - 使用空字符串避免显示 0
      setEditingPlan({
        name: '',
        description: '',
        duration_days: 30,
        price: undefined as any,
        original_price: undefined as any,
        features: '[]',
        is_active: true,
        sort_order: 0,
      });
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <button
          onClick={() => openEditModal()}
          className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
        >
          <Plus size={18} />
          添加套餐
        </button>
      </div>

      <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm relative'
          >
            <div className='absolute top-4 right-4 flex gap-2'>
              <button
                onClick={() => openEditModal(plan)}
                className='p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20'
              >
                <Edit2 size={16} />
              </button>
            </div>

            <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100 mb-1'>
              {plan.name}
            </h3>
            <div className='flex items-baseline gap-2 mb-2'>
              <span className='text-2xl font-bold text-blue-600'>
                ¥{plan.price}
              </span>
              {plan.original_price && (
                <span className='text-sm text-gray-400 line-through'>
                  ¥{plan.original_price}
                </span>
              )}
            </div>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-3'>
              {plan.description}
            </p>
            <div className='text-sm'>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
                时长:
              </span>{' '}
              {plan.duration_days} 天
            </div>
            <div className='mt-2'>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  plan.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {plan.is_active ? '已上架' : '已下架'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {editingPlan && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
          onClick={() => !saving && setEditingPlan(null)}
        >
          <div
            className='bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden'
            onClick={(e) => e.stopPropagation()}
          >
            {/* 固定头部 */}
            <div className='flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                {editingPlan.id ? '编辑套餐' : '添加套餐'}
              </h3>
            </div>

            {/* 可滚动内容区 */}
            <div className='flex-1 overflow-y-auto px-6 py-4'>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300'>
                    套餐名称 <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={editingPlan.name || ''}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, name: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500'
                    placeholder='例如：月度会员'
                    disabled={saving}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300'>
                      价格 (元) <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='number'
                      value={editingPlan.price ?? ''}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          price:
                            e.target.value === ''
                              ? (undefined as any)
                              : Number(e.target.value),
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500'
                      placeholder='19.9'
                      min='0'
                      step='0.01'
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300'>
                      原价 (元)
                    </label>
                    <input
                      type='number'
                      value={editingPlan.original_price ?? ''}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          original_price:
                            e.target.value === ''
                              ? (undefined as any)
                              : Number(e.target.value),
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500'
                      placeholder='29.9'
                      min='0'
                      step='0.01'
                      disabled={saving}
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300'>
                    有效天数 <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    value={editingPlan.duration_days ?? 30}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        duration_days: Number(e.target.value),
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500'
                    placeholder='30'
                    min='1'
                    disabled={saving}
                  />
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    购买后的会员有效期
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300'>
                    套餐描述
                  </label>
                  <input
                    type='text'
                    value={editingPlan.description || ''}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        description: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500'
                    placeholder='例如：超值月度会员'
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300'>
                    会员特权 (每行一个)
                  </label>
                  <textarea
                    value={(() => {
                      if (!editingPlan.features) return '';
                      try {
                        const arr = JSON.parse(editingPlan.features);
                        return Array.isArray(arr)
                          ? arr.join('\n')
                          : editingPlan.features;
                      } catch (e) {
                        return editingPlan.features;
                      }
                    })()}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n');
                      setEditingPlan({
                        ...editingPlan,
                        features: JSON.stringify(lines),
                      });
                    }}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 h-24 resize-none'
                    placeholder='去除广告&#10;高清观看&#10;离线下载'
                    disabled={saving}
                  />
                </div>

                <div className='flex items-center justify-between gap-4'>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={editingPlan.is_active ?? true}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          is_active: e.target.checked,
                        })
                      }
                      className='rounded border-gray-300 text-blue-600'
                      disabled={saving}
                    />
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      上架销售
                    </span>
                  </label>

                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      排序
                    </span>
                    <input
                      type='number'
                      value={editingPlan.sort_order ?? 0}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          sort_order: Number(e.target.value),
                        })
                      }
                      className='w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-100 text-center focus:ring-2 focus:ring-blue-500'
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 固定底部按钮 */}
            <div className='flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50'>
              <button
                onClick={() => setEditingPlan(null)}
                disabled={saving}
                className='px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 transition-colors'
              >
                取消
              </button>
              <button
                onClick={() => handleSave(editingPlan)}
                disabled={saving}
                className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors'
              >
                {saving && <Loader2 size={16} className='animate-spin' />}
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Check, Sparkles } from 'lucide-react';
import type { SubscriptionPlan } from '@/lib/types';

export default function VipPage() {
    const router = useRouter();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await fetch('/api/user/plans');
            const data = await response.json();
            if (data.success) {
                setPlans(data.plans);
            }
        } catch (error) {
            console.error('获取套餐失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = (planId: number) => {
        router.push(`/vip/buy/${planId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* 页面标题 */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Crown className="w-12 h-12 text-yellow-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        开通 MoonTV 会员
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        享受无广告、高清播放等专属特权
                    </p>
                </div>

                {/* 套餐卡片 */}
                {plans.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            暂无可用套餐，请联系管理员
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {plans.map((plan) => {
                            // 判断是否是推荐套餐（可以根据 sort_order 或其他字段）
                            const isRecommended = plan.sort_order === 2; // 示例：第2个套餐为推荐

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${isRecommended
                                            ? 'ring-4 ring-purple-500 ring-opacity-50'
                                            : ''
                                        }`}
                                >
                                    {/* 推荐标签 */}
                                    {isRecommended && (
                                        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-bl-lg flex items-center gap-1">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-sm font-semibold">推荐</span>
                                        </div>
                                    )}

                                    <div className="bg-white dark:bg-gray-800 p-8">
                                        {/* 套餐名称 */}
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            {plan.name}
                                        </h2>

                                        {/* 套餐描述 */}
                                        <p className="text-gray-600 dark:text-gray-400 mb-6 h-12">
                                            {plan.description}
                                        </p>

                                        {/* 价格 */}
                                        <div className="mb-6">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                                                    ¥{plan.price}
                                                </span>
                                                {plan.original_price && plan.original_price > plan.price && (
                                                    <span className="text-lg text-gray-400 line-through">
                                                        ¥{plan.original_price}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {plan.duration_days} 天
                                            </p>
                                        </div>

                                        {/* 功能列表 */}
                                        <div className="space-y-3 mb-8">
                                            {plan.features && Array.isArray(plan.features) && plan.features.length > 0 ? (
                                                plan.features.map((feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                                                    >
                                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                    <span>VIP 特权</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* 购买按钮 */}
                                        <button
                                            onClick={() => handleBuy(plan.id!)}
                                            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${isRecommended
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                                                }`}
                                        >
                                            立即购买
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 说明文字 */}
                <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>· 购买后请上传支付凭证，管理员将在 24 小时内审核开通</p>
                    <p className="mt-2">· 如有问题请联系客服</p>
                </div>
            </div>
        </div>
    );
}

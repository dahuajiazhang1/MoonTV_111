'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Calendar, Gift, ArrowRight } from 'lucide-react';

interface SubscriptionInfo {
    status: 'active' | 'expired' | 'cancelled';
    plan_name?: string;
    plan_features?: string[];
    start_date: string;
    end_date: string;
    days_remaining: number;
}

export default function SubscriptionPage() {
    const router = useRouter();
    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const response = await fetch('/api/user/subscription');
            const data = await response.json();

            if (data.success) {
                setIsSubscribed(data.subscribed);
                setSubscription(data.subscription);
            }
        } catch (error) {
            console.error('获取订阅信息失败:', error);
        } finally {
            setLoading(false);
        }
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

    // 未订阅状态
    if (!isSubscribed || !subscription) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Crown className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            开通会员享特权
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            您还不是会员，开通会员即可享受专属特权
                        </p>
                        <button
                            onClick={() => router.push('/vip')}
                            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition"
                        >
                            查看套餐
                        </button>
                        <button
                            onClick={() => router.push('/orders')}
                            className="w-full mt-3 py-3 px-6 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition"
                        >
                            查看订单
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 已订阅状态
    const isExpiring = subscription.days_remaining <= 7 && subscription.days_remaining > 0;
    const isExpired = subscription.status === 'expired';

    let features: string[] = [];
    if (subscription.plan_features) {
        if (typeof subscription.plan_features === 'string') {
            try {
                features = JSON.parse(subscription.plan_features);
            } catch {
                features = [subscription.plan_features];
            }
        } else if (Array.isArray(subscription.plan_features)) {
            features = subscription.plan_features;
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* VIP 身份卡 */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <Crown className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {subscription.plan_name || 'VIP 会员'}
                                </h1>
                                <p className="text-purple-100">
                                    {isExpired ? '已过期' : '会员有效期内'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm text-purple-100">开通日期</span>
                            </div>
                            <p className="text-lg font-semibold">
                                {new Date(subscription.start_date).toLocaleDateString('zh-CN')}
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm text-purple-100">到期日期</span>
                            </div>
                            <p className="text-lg font-semibold">
                                {new Date(subscription.end_date).toLocaleDateString('zh-CN')}
                            </p>
                        </div>
                    </div>

                    {!isExpired && (
                        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                            <p className="text-sm text-purple-100">剩余天数</p>
                            <p className="text-4xl font-bold mt-1">
                                {subscription.days_remaining}
                                <span className="text-lg ml-1">天</span>
                            </p>
                        </div>
                    )}

                    {isExpiring && (
                        <div className="mt-4 bg-yellow-500/20 border border-yellow-400/30 backdrop-blur-sm rounded-lg p-3 text-center">
                            <p className="text-sm font-medium">
                                ⚠️ 会员即将到期，请及时续费以继续享受特权
                            </p>
                        </div>
                    )}

                    {isExpired && (
                        <div className="mt-4 bg-red-500/20 border border-red-400/30 backdrop-blur-sm rounded-lg p-3 text-center">
                            <p className="text-sm font-medium">
                                ❌ 会员已过期，请续费以继续使用
                            </p>
                        </div>
                    )}
                </div>

                {/* 会员特权 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Gift className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            会员特权
                        </h2>
                    </div>

                    {features.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                                >
                                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                            暂无特权信息
                        </p>
                    )}
                </div>

                {/* 操作按钮 */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => router.push('/vip')}
                        className="py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                    >
                        {isExpired ? '重新开通' : '续费会员'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => router.push('/orders')}
                        className="py-3 px-6 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition"
                    >
                        订单记录
                    </button>
                </div>
            </div>
        </div>
    );
}

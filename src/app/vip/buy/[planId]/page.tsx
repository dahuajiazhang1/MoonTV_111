'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import type { SubscriptionPlan, PaymentSettings } from '@/lib/types';

export default function BuyPlanPage() {
    const router = useRouter();
    const params = useParams();
    const planId = params.planId as string;

    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [proofImage, setProofImage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [orderNo, setOrderNo] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [planId]);

    const fetchData = async () => {
        try {
            // 获取套餐信息
            const plansRes = await fetch('/api/user/plans');
            const plansData = await plansRes.json();
            if (plansData.success) {
                const selectedPlan = plansData.plans.find((p: SubscriptionPlan) => p.id === Number(planId));
                setPlan(selectedPlan || null);
            }

            // 获取支付设置
            const settingsRes = await fetch('/api/user/payment-settings');
            const settingsData = await settingsRes.json();
            if (settingsData.success) {
                setPaymentSettings(settingsData.settings);
            }
        } catch (error) {
            console.error('获取数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 检查文件大小 (最大 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过 5MB');
            return;
        }

        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            alert('请上传图片文件');
            return;
        }

        setUploading(true);

        // 转换为 Base64
        const reader = new FileReader();
        reader.onload = () => {
            setProofImage(reader.result as string);
            setUploading(false);
        };
        reader.onerror = () => {
            alert('图片读取失败，请重试');
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!proofImage) {
            alert('请先上传支付凭证');
            return;
        }

        if (!plan) {
            alert('套餐信息加载失败');
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch('/api/user/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId: plan.id,
                    paymentProof: proofImage,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setOrderNo(data.orderNo);
                // 3秒后跳转到订单列表
                setTimeout(() => {
                    router.push('/orders');
                }, 3000);
            } else {
                alert(data.error || '提交订单失败');
            }
        } catch (error) {
            console.error('提交订单失败:', error);
            alert('提交订单失败，请重试');
        } finally {
            setSubmitting(false);
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

    if (!plan) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">套餐不存在</p>
                    <button
                        onClick={() => router.push('/vip')}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        返回选择套餐
                    </button>
                </div>
            </div>
        );
    }

    // 订单提交成功
    if (orderNo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center max-w-md">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        订单提交成功！
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        订单号：{orderNo}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        管理员将在 24 小时内审核您的订单，请耐心等待。
                    </p>
                    <button
                        onClick={() => router.push('/orders')}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        查看我的订单
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* 返回按钮 */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    返回
                </button>

                {/* 套餐信息卡片 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        订单确认
                    </h1>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {plan.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    {plan.description}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                    有效期：{plan.duration_days} 天
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    ¥{plan.price}
                                </div>
                                {plan.original_price && plan.original_price > plan.price && (
                                    <div className="text-sm text-gray-400 line-through mt-1">
                                        ¥{plan.original_price}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 功能列表 */}
                        {plan.features && Array.isArray(plan.features) && plan.features.length > 0 && (
                            <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    套餐特权：
                                </p>
                                <ul className="space-y-1">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* 支付信息卡片 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        支付信息
                    </h2>

                    {paymentSettings?.alipay_qr_code && (
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                请使用支付宝扫描下方二维码完成支付：
                            </p>
                            <div className="flex justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                                <img
                                    src={paymentSettings.alipay_qr_code}
                                    alt="支付宝收款码"
                                    className="w-64 h-64 object-contain"
                                />
                            </div>
                            {paymentSettings.alipay_account_name && (
                                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
                                    收款方：{paymentSettings.alipay_account_name}
                                </p>
                            )}
                        </div>
                    )}

                    {paymentSettings?.payment_notice && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                {paymentSettings.payment_notice}
                            </p>
                        </div>
                    )}

                    {/* 上传支付凭证 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            上传支付凭证 <span className="text-red-500">*</span>
                        </label>

                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="proof-upload"
                                disabled={uploading || submitting}
                            />

                            {proofImage ? (
                                <div className="space-y-4">
                                    <img
                                        src={proofImage}
                                        alt="支付凭证"
                                        className="max-w-full max-h-64 mx-auto rounded-lg"
                                    />
                                    <button
                                        onClick={() => setProofImage(null)}
                                        className="text-sm text-red-600 hover:text-red-700"
                                        disabled={submitting}
                                    >
                                        重新上传
                                    </button>
                                </div>
                            ) : (
                                <label
                                    htmlFor="proof-upload"
                                    className="cursor-pointer block"
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                                        {uploading ? '上传中...' : '点击上传支付截图'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        支持 JPG、PNG 格式，最大 5MB
                                    </p>
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {/* 提交按钮 */}
                <button
                    onClick={handleSubmit}
                    disabled={!proofImage || submitting}
                    className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? '提交中...' : '提交订单'}
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                    提交后请等待管理员审核，审核通过后将自动开通会员
                </p>
            </div>
        </div>
    );
}

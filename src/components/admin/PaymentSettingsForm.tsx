'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { PaymentSettings } from '@/lib/types';
import { Save } from 'lucide-react';

export default function PaymentSettingsForm() {
    const [settings, setSettings] = useState<PaymentSettings>({
        alipay_qr_code: '',
        alipay_account_name: '',
        payment_notice: '',
        auto_approval: false,
        order_expire_hours: 24,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/payment-settings');
            if (res.ok) {
                const data = await res.json();
                if (data && Object.keys(data).length > 0) {
                    setSettings(data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch payment settings', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/payment-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '保存成功',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                throw new Error('Save failed');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: '保存失败',
                text: '请重试',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    支付宝收款码 URL
                </label>
                <input
                    type="text"
                    value={settings.alipay_qr_code || ''}
                    onChange={(e) => setSettings({ ...settings, alipay_qr_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/qr.jpg"
                />
                <p className="text-xs text-gray-500">可以是图片链接或 Base64</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    收款账户名称
                </label>
                <input
                    type="text"
                    value={settings.alipay_account_name || ''}
                    onChange={(e) => setSettings({ ...settings, alipay_account_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                    placeholder="例如：*某某"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    支付提示信息
                </label>
                <textarea
                    value={settings.payment_notice || ''}
                    onChange={(e) => setSettings({ ...settings, payment_notice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="支付时请备注用户名..."
                />
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="auto_approval"
                        checked={settings.auto_approval || false}
                        onChange={(e) => setSettings({ ...settings, auto_approval: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="auto_approval" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        自动审核 (实验性)
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    订单过期时间 (小时)
                </label>
                <input
                    type="number"
                    value={settings.order_expire_hours || 24}
                    onChange={(e) => setSettings({ ...settings, order_expire_hours: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                <Save size={18} />
                {loading ? '保存中...' : '保存设置'}
            </button>
        </form>
    );
}

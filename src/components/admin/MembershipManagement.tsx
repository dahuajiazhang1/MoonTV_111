'use client';

import { useState } from 'react';
import SubscriptionPlansManager from './SubscriptionPlansManager';
import OrderManager from './OrderManager';
import PaymentSettingsForm from './PaymentSettingsForm';
import { CreditCard, List, Settings } from 'lucide-react';

export default function MembershipManagement() {
    const [activeTab, setActiveTab] = useState<'plans' | 'orders' | 'settings'>('plans');

    return (
        <div className="space-y-6">
            {/* Sub-tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('plans')}
                    className={`px-4 py-2 border-b-2 flex items-center gap-2 ${activeTab === 'plans'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <List size={18} />
                    套餐管理
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 border-b-2 flex items-center gap-2 ${activeTab === 'orders'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <CreditCard size={18} />
                    订单审核
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 border-b-2 flex items-center gap-2 ${activeTab === 'settings'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Settings size={18} />
                    支付设置
                </button>
            </div>

            <div className="pt-2">
                {activeTab === 'plans' && <SubscriptionPlansManager />}
                {activeTab === 'orders' && <OrderManager />}
                {activeTab === 'settings' && <PaymentSettingsForm />}
            </div>
        </div>
    );
}

'use client';

import { useEffect } from 'react';

export default function MoonHome() {
    useEffect(() => {
        console.log('MoonTV MoonHome Sanity Check v1.0.0 LOADED');
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-2xl font-bold">
            <div>MoonTV Sanity Check</div>
            <div className="text-sm mt-4 text-gray-500">
                如果看到此页面，说明 MoonHome 组件本身没有问题，问题在被移除的代码中。
            </div>
        </div>
    );
}

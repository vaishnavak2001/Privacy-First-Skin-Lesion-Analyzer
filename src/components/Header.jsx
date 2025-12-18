import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white border-b border-brand-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-8 w-8 text-brand-600" />
                        <h1 className="text-2xl font-bold text-brand-900 tracking-tight">
                            DermaCheck AI
                        </h1>
                    </div>
                    <nav>
                        <button className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors">
                            About
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;

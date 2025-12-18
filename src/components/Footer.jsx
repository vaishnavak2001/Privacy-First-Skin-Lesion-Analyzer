import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-brand-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} DermaCheck AI. Privacy-first skin analysis.
                </p>
                <p className="mt-2 text-center text-xs text-slate-400 max-w-2xl mx-auto">
                    Disclaimer: This tool is for educational purposes only and does not provide a medical diagnosis. Always consult a professional for medical concerns.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

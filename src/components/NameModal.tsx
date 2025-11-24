"use client";

import React, { useState } from 'react';

interface NameModalProps {
    isOpen: boolean;
    onSubmit: (name: string) => void;
}

export default function NameModal({ isOpen, onSubmit }: NameModalProps) {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-4 text-black text-center">ברוכים הבאים!</h2>
                <p className="text-gray-800 mb-6 text-center font-medium">אנא הזינו את שמכם המלא כדי להמשיך</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="שם מלא"
                            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-right text-black placeholder-gray-600"
                            autoFocus
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                    >
                        המשך
                    </button>
                </form>
            </div>
        </div>
    );
}

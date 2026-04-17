"use client";

import React, { useState, ChangeEvent } from 'react';
import { uploadUlog } from '@/services/api';

interface AnalysisResult {
    total_area_coverage?: string;
    monitoring_efficiency?: string;
}

export default function Home() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'result'>('idle');
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setStatus('loading');
            try {
                const response = await uploadUlog(selectedFile);
                setResult(response.data.data);
                setStatus('result');
            } catch (err) {
                alert("Gagal terhubung ke Backend!");
                setStatus('idle');
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#4a4a4a', color: 'white', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
            <header style={{ padding: '32px 40px', display: 'flex', alignItems: 'center', gap: '32px' }}>
                <img src="/logo.png" alt="AMX UAV" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
                <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: 0 }}>Monitoring Flight</h1>
            </header>

            <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                {status === 'idle' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '24px' }}>Upload Data</h2>
                        <label style={{ cursor: 'pointer', backgroundColor: '#FFD700', width: '220px', height: '80px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <input type="file" className="hidden" accept=".ulg" style={{ display: 'none' }} onChange={handleFileChange} />
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </label>
                        <p style={{ marginTop: '16px', color: '#d1d5db' }}>*file must be in .ulg</p>
                    </div>
                )}

                {status === 'loading' && <h2 style={{ fontSize: '40px', fontWeight: 'bold' }}>Processing...</h2>}

                {status === 'result' && (
                    <div style={{ display: 'flex', width: '100%', maxWidth: '1100px', justifyContent: 'space-between', gap: '64px' }}>
                        <div style={{ backgroundColor: 'white', width: '600px', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: 'black', fontSize: '48px', fontWeight: 'bold' }}>Mapping</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Total Area Coverage</h3>
                                <p style={{ fontSize: '48px', fontWeight: 'bold' }}>{result?.total_area_coverage || 'Number'}</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Monitoring Efficiency</h3>
                                <p style={{ fontSize: '48px', fontWeight: 'bold' }}>{result?.monitoring_efficiency || 'Number'}</p>
                            </div>
                            <button style={{ backgroundColor: '#FFD700', width: '220px', height: '80px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <footer style={{ width: '100%', textAlign: 'center', padding: '32px 0', color: '#d1d5db' }}>
                Copyright © 2026 AMX UAV
            </footer>
        </div>
    );
}
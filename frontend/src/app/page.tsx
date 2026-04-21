"use client";

import React, { useState, ChangeEvent, useEffect } from 'react';
import { uploadUlog } from '@/services/api';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/map'), {
    ssr: false,
    loading: () => (
        <div style={{height: '100%', width: '100%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center',  justifyContent: 'center', color: '#6b7280', fontWeight: 'bold'}}>
            Loading Map...
        </div>
    )
});

interface AnalysisResult {
    total_area_coverage?: string;
    flight_duration?: string;
    total_distance?: string;
    average_altitude?: string;
    polygon?: [number, number][];
    starting_point?: [number, number];
}

export default function Home() {
    // 1. Status awal 'checking' untuk pengecekan session saat pertama kali load
    const [status, setStatus] = useState<'idle' | 'checking' | 'uploading' | 'result'>('checking');
    const [result, setResult] = useState<AnalysisResult | null>(null);

    // 2. Efek untuk memulihkan data dari session saat refresh
    useEffect(() => {
        const savedResult = sessionStorage.getItem('last_analysis');
        if (savedResult) {
            try {
                setResult(JSON.parse(savedResult));
                setStatus('result');
            } catch (error) {
                console.error("Session data corrupted:", error);
                sessionStorage.removeItem('last_analysis');
                setStatus('idle');
            }
        } else {
            setStatus('idle');
        }
    }, []);

    // 3. Fungsi upload file (Processing)
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setStatus('uploading'); // Muncul tulisan "Processing..."
            try {
                const response = await uploadUlog(selectedFile);
                const data = response.data.data;
                
                setResult(data);
                // Simpan ke sessionStorage (tahan refresh, hapus saat close tab)
                sessionStorage.setItem('last_analysis', JSON.stringify(data));
                setStatus('result');
            } catch (err) {
                alert("Failed to connect to Backend!");
                setStatus('idle');
            }
        }
    };

    // 4. Fungsi Reset untuk pindah ke file lain
    const handleReset = () => {
        sessionStorage.removeItem('last_analysis');
        setResult(null);
        setStatus('idle');
    };

    // LAYAR LOADING AWAL: Menghindari flicker menu upload saat refresh
    if (status === 'checking') {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#4a4a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>Checking Session...</h2>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#4a4a4a', color: 'white', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
            
            {/* --- HEADER --- */}
            <header style={{ backgroundColor: 'black', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px'}}>
                    <img src="/logo.png" alt="AMX UAV Logo" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}> Monitoring Flight </h1>
                </div>
                <button 
                    onClick={() => window.location.href = 'http://localhost:3000'}
                    style={{ backgroundColor: '#FFDD00', color: 'black', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: 'pointer' }}>
                    Visit Our Page
                </button>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', width: '100%' }}>
                
                {/* STATUS: IDLE (Upload Menu) */}
                {status === 'idle' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '24px' }}>Upload Data</h2>
                        <label style={{ cursor: 'pointer', backgroundColor: '#FFDD00', width: '220px', height: '80px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
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

                {/* STATUS: UPLOADING (Processing Screen) */}
                {status === 'uploading' && <h2 style={{ fontSize: '40px', fontWeight: 'bold' }}>Processing...</h2>}

                {/* STATUS: RESULT (Dashboard Results) */}
                {status === 'result' && (
                    <div style={{ display: 'flex', width: '100%', maxWidth: '1200px', gap: '30px', alignItems: 'stretch', minHeight: '600px' }}>
                        
                        {/* Kiri: Map Display */}
                        <div style={{ flex: '2', backgroundColor: 'white', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', flexDirection: 'column' }}>
                            {result?.polygon ? (
                                <MapView polygon={result.polygon} startPoint={result.starting_point as [number, number]} />
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <h2 style={{ color: 'black', fontSize: '36px', fontWeight: 'bold' }}> Polygonized Mapping </h2>
                                </div>
                            )}
                        </div>

                        {/* Kanan: Stats & Action Buttons */}
                        <div style={{ flex: '1', backgroundColor: '#323232', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '8px', justifyContent: 'center' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', textAlign: 'center', color: 'white' }}>
                                Mapping Result
                            </h2>

                            {/* Tombol Analyze Another (Compact & Outline) */}
                            <button
                                onClick={handleReset}
                                style={{ backgroundColor: 'transparent', color: '#FFD000', padding: '8px', fontWeight: 'bold', fontSize: '14px', border: '1px solid #FFD000', cursor: 'pointer', borderRadius: '8px' }}>
                                🔄 Analyze Another File
                            </button>

                            {/* Big Stats: Total Area */}
                            <div style={{ backgroundColor: '#8A8A8A', padding: '30px 20px', textAlign: 'center', borderRadius: '8px' }}>
                                <p style={{ margin: '0 0 15px 0', fontSize: '22px',  fontWeight: 'bold', color: 'white' }}> Total Area Coverage </p>
                                <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: 'white' }}>
                                    {result?.total_area_coverage || '0.00 Ha'}
                                </p>
                            </div>

                            {/* Detail Stats Grid */}
                            <div style={{ backgroundColor: '#8A8A8A', padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px', borderRadius: '8px', color: 'white', fontSize: '18px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 'bold' }}> Flight Duration: </span>
                                    <span>{result?.flight_duration || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 'bold' }}> Total Distance: </span>
                                    <span>{result?.total_distance || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 'bold' }}> Average Altitude: </span>
                                    <span>{result?.average_altitude || '-'}</span>
                                </div>
                            </div>

                            {/* Download Buttons (Compact Port 5000) */}
                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button
                                    onClick={() => window.location.href = 'http://localhost:5000/download/kml'}
                                    style={{ flex: 1, backgroundColor: '#FFD000', color: 'black', padding: '15px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', borderRadius: '8px' }}>
                                    Download KML
                                </button>
                                <button
                                    onClick={() => window.location.href = 'http://localhost:5000/download/pdf'}
                                    style={{ flex: 1, backgroundColor: '#FFD000', color: 'black', padding: '15px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', borderRadius: '8px' }}>
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* --- FOOTER --- */}
            <footer style={{ width: '100%', textAlign: 'center', padding: '32px 0', color: '#d1d5db' }}>
                Copyright © 2026 AMX UAV
            </footer>
        </div>
    );
}
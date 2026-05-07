"use client";

import React, { useState, ChangeEvent, useEffect } from 'react';
import { uploadUlog } from '@/services/api';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/map'), {
    ssr: false,
    loading: () => (
        <div style={{height: '100%', width: '100%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 'bold'}}>
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
    const [status, setStatus] = useState<'idle' | 'checking' | 'uploading' | 'result'>('checking');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 968);
        handleResize();
        window.addEventListener('resize', handleResize);
        
        const savedResult = sessionStorage.getItem('last_analysis');
        if (savedResult) {
            try {
                setResult(JSON.parse(savedResult));
                setStatus('result');
            } catch (error) {
                sessionStorage.removeItem('last_analysis');
                setStatus('idle');
            }
        } else {
            setStatus('idle');
        }
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.name.endsWith('.ulg')) {
                alert("Wrong type of file! Please upload a .ulg file.");
                return;
            }
            if (selectedFile.size > 100 * 1024 * 1024) {
                alert("File size exceeds the 100MB limit!");
                return;
            }

            setStatus('uploading');
            try {
                const response = await uploadUlog(selectedFile);
                const data = response.data.data;
                setResult(data);
                sessionStorage.setItem('last_analysis', JSON.stringify(data));
                setStatus('result');
            } catch (err) {
                alert("Failed to connect to Backend!");
                setStatus('idle');
            }
        }
    };

    const handleReset = () => {
        sessionStorage.removeItem('last_analysis');
        setResult(null);
        setStatus('idle');
    };

    if (status === 'checking') {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#4a4a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>Checking Session...</h2>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#4a4a4a', color: 'white', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
            <header style={{ 
                backgroundColor: 'black', 
                padding: isMobile ? '12px 20px' : '16px 40px', 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '15px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '20px'}}>
                    <img src="/logo.png" alt="AMX UAV Logo" style={{ height: isMobile ? '35px' : '50px', width: 'auto', objectFit: 'contain' }} />
                    <h1 style={{ fontSize: isMobile ? '22px' : '32px', fontWeight: 'bold', margin: 0 }}> Monitoring Flight </h1>
                </div>
                <button 
                    onClick={() => window.location.href = 'http://localhost:3000'}
                    style={{ backgroundColor: '#959595', color: 'black', padding: isMobile ? '10px 16px' : '12px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: isMobile ? '14px' : '18px', border: 'none', cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>
                    Visit Our Page
                </button>
            </header>

            <main style={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: status === 'result' ? 'flex-start' : 'center', 
                padding: isMobile ? '20px' : '40px', 
                width: '100%',
                boxSizing: 'border-box',
                paddingBottom: isMobile ? '60px' : '40px'
            }}>
                {status === 'idle' && (
                    <div style={{ textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                        <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 'bold', marginBottom: '24px' }}>Upload Data</h2>
                        <label style={{ cursor: 'pointer', backgroundColor: '#959595', width: '180px', height: '70px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                            <input type="file" className="hidden" accept=".ulg" style={{ display: 'none' }} onChange={handleFileChange} />
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </label>
                        <p style={{ marginTop: '16px', color: '#d1d5db', fontSize: '14px' }}>*file must be in .ulg (Max 100MB)</p>
                    </div>
                )}

                {status === 'uploading' && (
                    <div style={{ textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                        <div style={{ border: '6px solid rgba(255, 255, 255, 0.1)', borderTop: '6px solid #959595', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                        <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>Processing...</h2>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {status === 'result' && (
                    <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', alignItems: 'stretch', width: '100%' }}>
                            <div style={{ 
                                flex: isMobile ? 'none' : '2', 
                                width: '100%', 
                                backgroundColor: 'white', 
                                padding: '8px', 
                                borderRadius: '8px', 
                                height: isMobile ? '350px' : '500px', 
                                display: 'block', 
                                position: 'relative',
                                boxSizing: 'border-box'
                            }}>
                                {result?.polygon ? (
                                    <MapView polygon={result.polygon} startPoint={result.starting_point as [number, number]} />
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <h2 style={{ color: 'black', fontSize: isMobile ? '24px' : '36px', fontWeight: 'bold' }}> Mapping Area </h2>
                                    </div>
                                )}
                            </div>

                            <div style={{ 
                                flex: isMobile ? 'none' : '1', 
                                width: '100%', 
                                backgroundColor: '#323232', 
                                padding: isMobile ? '20px' : '30px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '15px', 
                                borderRadius: '8px', 
                                justifyContent: 'center',
                                boxSizing: 'border-box'
                            }}>
                                <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold', margin: '0', textAlign: 'center', color: 'white' }}>
                                    Mapping Result
                                </h2>
                                <button onClick={handleReset} style={{ backgroundColor: 'transparent', color: '#DADEDF', padding: '8px', fontWeight: 'bold', fontSize: '12px', border: '1px solid #DADEDF', cursor: 'pointer', borderRadius: '8px' }}>🔄 Analyze Another File</button>
                                <div style={{ backgroundColor: '#8A8A8A', padding: isMobile ? '20px' : '30px 20px', textAlign: 'center', borderRadius: '8px' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: isMobile ? '16px' : '22px',  fontWeight: 'bold', color: 'white' }}> Total Area Coverage </p>
                                    <p style={{ margin: 0, fontSize: isMobile ? '28px' : '36px', fontWeight: 'bold', color: '#DADEDF' }}>{result?.total_area_coverage || '0.00 Ha'}</p>
                                </div>
                                <div style={{ backgroundColor: '#8A8A8A', padding: isMobile ? '15px' : '25px', display: 'flex', flexDirection: 'column', gap: '10px', borderRadius: '8px', color: 'white', fontSize: isMobile ? '15px' : '18px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span> Duration: </span><span>{result?.flight_duration || '-'}</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span> Distance: </span><span>{result?.total_distance || '-'}</span></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span> Avg Alt: </span><span>{result?.average_altitude || '-'}</span></div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                    <button onClick={() => window.location.href = 'http://localhost:5000/download/kml'} style={{ flex: 1, backgroundColor: '#DADEDF', color: 'black', padding: '12px', fontWeight: 'bold', fontSize: isMobile ? '13px' : '16px', border: 'none', cursor: 'pointer', borderRadius: '8px' }}>KML</button>
                                    <button onClick={() => window.location.href = 'http://localhost:5000/download/pdf'} style={{ flex: 1, backgroundColor: '#DADEDF', color: 'black', padding: '12px', fontWeight: 'bold', fontSize: isMobile ? '13px' : '16px', border: 'none', cursor: 'pointer', borderRadius: '8px' }}>PDF</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <footer style={{ width: '100%', textAlign: 'center', padding: '20px 0', color: '#d1d5db', fontSize: '12px', boxSizing: 'border-box' }}>
                Copyright © 2026 AMX UAV
            </footer>
        </div>
    );
}
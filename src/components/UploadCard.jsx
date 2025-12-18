import React, { useState, useRef } from 'react';
import { Camera, X, Loader2, ShieldCheck } from 'lucide-react';
import { useModel } from '../hooks/useModel';
import { interpretSkinResult } from '../utils/analysis';

const UploadCard = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const imageRef = useRef(null);

    const { model, loading: modelLoading, error: modelError, analyzeImage } = useModel();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        processFile(file);
    };

    const processFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setPredictions([]); // Clear previous predictions
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const clearImage = () => {
        setSelectedImage(null);
        setPredictions([]);
    };

    const handleAnalyze = async () => {
        if (!imageRef.current || !model) return;

        setIsAnalyzing(true);
        try {
            const results = await analyzeImage(imageRef.current);
            setPredictions(results);
        } catch (err) {
            console.error("Analysis failed", err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-brand-100 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-brand-900 mb-2">
                        Skin Lesion Analysis
                    </h2>
                    <p className="text-slate-600">
                        Upload or take a photo of the skin patch you want to analyze.
                    </p>
                    {modelLoading && (
                        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-brand-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Loading AI Model...</span>
                        </div>
                    )}
                    {modelError && (
                        <div className="mt-2 text-sm text-red-500">
                            Error loading model: {modelError}
                        </div>
                    )}
                </div>

                {selectedImage ? (
                    <div className="space-y-6">
                        <div className="relative rounded-xl overflow-hidden shadow-md border border-brand-200 bg-slate-50">
                            <img
                                ref={imageRef}
                                src={selectedImage}
                                alt="Skin lesion preview"
                                className="w-full h-auto max-h-96 object-contain mx-auto"
                            />
                            <button
                                onClick={clearImage}
                                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white text-slate-600 hover:text-red-500 transition-colors"
                                aria-label="Remove image"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {predictions.length > 0 && (
                            (() => {
                                const result = interpretSkinResult(predictions);
                                return (
                                    <div className={`${result.theme.bg} rounded-xl p-6 border ${result.theme.border} transition-all animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-semibold text-brand-900 mb-1">AI Analysis Result</h3>
                                                <p className="text-sm text-slate-600">{result.message}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${result.theme.badge}`}>
                                                {result.badge}
                                            </span>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-500 font-medium">Confidence Score</span>
                                                <span className={result.theme.text}>{result.score}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-1000 ${result.status === 'high' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${result.score}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <p className="mt-4 text-[10px] text-slate-400 italic">
                                            Disclaimer: This is a prototype simulation. Not for medical diagnosis.
                                        </p>
                                    </div>
                                );
                            })()
                        )}
                    </div>
                ) : (
                    <div
                        className={`
              relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ease-in-out
              ${isDragging
                                ? 'border-brand-500 bg-brand-50'
                                : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                            }
            `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            id="file-upload"
                        />

                        <div className="flex flex-col items-center justify-center pointer-events-none">
                            <div className="bg-brand-100 p-4 rounded-full mb-4">
                                <Camera className="w-8 h-8 text-brand-600" />
                            </div>
                            <p className="text-lg font-medium text-slate-700 mb-1">
                                Upload or Capture Photo
                            </p>
                            <p className="text-sm text-slate-500">
                                Drag and drop or click to select
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-center">
                    {selectedImage ? (
                        <button
                            onClick={handleAnalyze}
                            disabled={modelLoading || isAnalyzing}
                            className={`
                        px-6 py-3 font-medium rounded-lg shadow-sm transition-colors w-full sm:w-auto flex items-center justify-center gap-2
                        ${modelLoading || isAnalyzing
                                    ? 'bg-brand-200 text-brand-700 cursor-wait'
                                    : 'bg-brand-600 text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500'
                                }
                    `}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze Image'
                            )}
                        </button>
                    ) : (
                        <button disabled className="px-6 py-3 bg-slate-200 text-slate-400 font-medium rounded-lg cursor-not-allowed w-full sm:w-auto">
                            Analyze Image
                        </button>
                    )}

                </div>

                <div className="mt-8 p-4 bg-brand-50 border border-brand-100 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-brand-900">
                        <span className="font-semibold text-brand-900 block sm:inline">Privacy Notice:</span>{' '}
                        All analysis happens 100% on your device. Your photos are never sent to a cloud server.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UploadCard;

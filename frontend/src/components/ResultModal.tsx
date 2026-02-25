import { X, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface Result {
    class: string;
    confidence: number;
    stage: string;
}

interface ResultModalProps {
    result: Result | null;
    onClose: () => void;
}

export default function ResultModal({ result, onClose }: ResultModalProps) {
    if (!result) return null;

    const getStatusColor = (diagnosis: string) => {
        if (diagnosis === 'Melanoma') return 'red';
        if (diagnosis === 'Tinea') return 'orange';
        if (diagnosis === 'Random Object') return 'gray';
        return 'blue';
    };

    const color = getStatusColor(result.class);

    const colorMap: Record<string, { bg: string; text: string; border: string; icon: string }> = {
        red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'bg-red-100 text-red-600' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'bg-orange-100 text-orange-600' },
        gray: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: 'bg-slate-100 text-slate-600' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600' },
    };

    const theme = colorMap[color];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Analysis Result</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-8 flex flex-col items-center text-center">
                    <div className={clsx("w-20 h-20 rounded-full flex items-center justify-center mb-6", theme.icon)}>
                        {result.class === 'Melanoma' && <AlertOctagon className="w-10 h-10" />}
                        {result.class === 'Tinea' && <AlertTriangle className="w-10 h-10" />}
                        {result.class === 'Random Object' && <HelpCircle className="w-10 h-10" />}
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{result.class}</h2>

                    <div className={clsx("px-4 py-1 rounded-full text-sm font-medium mb-8 flex items-center gap-2", theme.bg, theme.text)}>
                        <span>Confidence: {(result.confidence * 100).toFixed(1)}%</span>
                        <div className="w-1 h-1 bg-current rounded-full" />
                        <span>Stage: {result.stage}</span>
                    </div>

                    <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 text-left">
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">Recommendation</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {result.class === 'Melanoma' && "High risk detected. Immediate consultation with a dermatologist is strongly recommended for further evaluation."}
                            {result.class === 'Tinea' && "Fungal infection detected. Consult a healthcare provider for appropriate antifungal treatment options."}
                            {result.class === 'Random Object' && "The image does not appear to be showing skin. Please upload a clear image of the affected skin area."}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                        Close
                    </button>
                    <button onClick={() => window.print()} className="flex-1 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200">
                        Save Report
                    </button>
                </div>
            </div>
        </div>
    );
}

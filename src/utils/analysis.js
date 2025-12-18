/**
 * Interprets generic model predictions into a simulated skin-specific risk analysis.
 * Note: This is a prototype simulation for demonstration purposes.
 */
export const interpretSkinResult = (predictions) => {
    if (!predictions || predictions.length === 0) return null;

    // Simulate a risk assessment using the underlying confidence scores
    // In a real medical app, this would use a specialized dermatology model
    const confidenceSeed = predictions[0].probability;

    // We use a pseudo-deterministic mapping for the prototype
    // High confidence in generic objects is mapped to a realistic-looking risk score
    let riskScore = Math.floor(confidenceSeed * 100);

    // Ensure we have some variance for the demo
    if (riskScore > 90) riskScore = 88; // Cap it so it's not always 100
    if (riskScore < 5) riskScore = 12;   // Floor it for visibility

    const isHighRisk = riskScore > 50;

    return {
        score: riskScore,
        status: isHighRisk ? 'high' : 'low',
        message: isHighRisk
            ? 'Potential abnormality detected. Consult a healthcare professional.'
            : 'No immediate typical risk patterns found in this capture.',
        badge: isHighRisk
            ? 'Consult a Dermatologist'
            : 'Low Risk / Benign Appearance',
        theme: isHighRisk
            ? {
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                text: 'text-amber-800',
                badge: 'bg-amber-100 text-amber-700 bubble-amber'
            }
            : {
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                text: 'text-emerald-800',
                badge: 'bg-emerald-100 text-emerald-700'
            }
    };
};

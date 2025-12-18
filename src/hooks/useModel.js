import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

export const useModel = () => {
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
                console.log('Loading MobileNet model...');
                await tf.ready();
                const loadedModel = await mobilenet.load({
                    version: 2,
                    alpha: 1.0,
                });
                setModel(loadedModel);
                console.log('MobileNet model loaded successfully');
            } catch (err) {
                console.error('Failed to load model:', err);
                setError('Failed to load AI model');
            } finally {
                setLoading(false);
            }
        };

        loadModel();
    }, []);

    const analyzeImage = async (imageElement) => {
        if (!model) {
            throw new Error('Model not loaded yet');
        }

        try {
            const predictions = await model.classify(imageElement);
            return predictions;
        } catch (err) {
            console.error('Error analyzing image:', err);
            throw err;
        }
    };

    return { model, loading, error, analyzeImage };
};

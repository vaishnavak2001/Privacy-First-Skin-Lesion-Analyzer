import React from 'react';
import Layout from './components/Layout';
import UploadCard from './components/UploadCard';

function App() {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <UploadCard />
            </div>
        </Layout>
    );
}

export default App;

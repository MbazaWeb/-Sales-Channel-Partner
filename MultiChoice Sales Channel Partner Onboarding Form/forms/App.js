import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import MultiChoiceOnboardingForm from './MultiChoiceForm';

function App() {
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '10px', backgroundColor: '#282c34', color: 'white', textAlign: 'center' }}>
        <PDFDownloadLink 
          document={<MultiChoiceOnboardingForm />} 
          fileName="MAH_Sales_Partner_Onboarding.pdf"
          style={{
            textDecoration: 'none',
            padding: '10px 20px',
            color: '#fff',
            backgroundColor: '#007bff',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          {({ loading }) => (loading ? 'Preparing PDF...' : 'Download Onboarding Form')}
        </PDFDownloadLink>
      </nav>
      <PDFViewer style={{ flex: 1, border: 'none' }}>
        <MultiChoiceOnboardingForm />
      </PDFViewer>
    </div>
  );
}

export default App;

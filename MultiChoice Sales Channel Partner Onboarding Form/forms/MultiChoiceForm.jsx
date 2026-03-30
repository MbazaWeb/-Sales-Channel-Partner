import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 9, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, textAlign: 'center' },
  logo: { width: 120, alignSelf: 'center', marginBottom: 10 },
  section: { marginBottom: 10, border: '1pt solid #000', padding: 5 },
  title: { fontSize: 12, fontWeight: 'bold', marginBottom: 5, textDecoration: 'underline' },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { fontWeight: 'bold', marginRight: 5 },
  input: { borderBottom: '1pt solid #000', flex: 1, height: 12 },
  footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center' },
  footerLogo: { width: '100%', height: 30 }
});

const MultiChoiceOnboardingForm = () => (
  <Document>
    {/* PAGE 1: USER FORM */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src="Screenshot 2026-03-20 073202.png" />
        <Text style={styles.title}>Annexure A: MultiChoice SCP Application Form</Text>
      </View>
      
      <Text style={{ marginBottom: 10 }}>Business Details [cite: 9]</Text>
      <View style={styles.row}><Text style={styles.label}>Trading as:</Text><View style={styles.input} /></View>
      <View style={styles.row}><Text style={styles.label}>Registration No:</Text><View style={styles.input} /></View>
      
      <Text style={{ marginTop: 10 }}>Sales Channel Type [cite: 36]</Text>
      <Text>Agency / Retailer / Dealer / Installer [cite: 38, 43, 44, 49]</Text>

      <View style={styles.footer}>
        <Image style={styles.footerLogo} src="image_516618.png" />
      </View>
    </Page>

    {/* PAGE 2: STAFF FORM */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={[styles.title, { backgroundColor: '#eee' }]}>FOR INTERNAL USE </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>STOCKHANDLER INFORMATION </Text>
        <View style={styles.row}><Text>Name:</Text><View style={styles.input} /></View>
        <View style={styles.row}><Text>ID:</Text><View style={styles.input} /></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>CREDIT INFORMATION [cite: 109]</Text>
        <Text>$100 / $150 / $200 [cite: 111, 112, 114]</Text>
      </View>

      <View style={styles.footer}>
        <Image style={styles.footerLogo} src="image_516618.png" />
      </View>
    </Page>
  </Document>
);

export default MultiChoiceOnboardingForm;

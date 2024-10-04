// ./PDFs/NotarialDeed/notarialdeed.jsx
import React, { useEffect } from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import styles from './notarialdeed.js'; // Ensure this path is correct

export const NotarialDeed = ({ data, signature }) => {
  useEffect(() => {
    if (signature) {
      console.log("Rendering Notarial deed with signature: ", signature);
    } else {
      console.log("No signature provided.");
    }
    if (data) {
      console.log("Rendering NotarialDeed with data:", data);
    }
  }, [signature, data]);

  return (
    <Document>
      <Page style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text>REPUBLIC DU CAMEROUN</Text>
          <Text>REPUBLIC OF CAMEROON</Text>
          <Text>_______________</Text>
          <Text>CONSERVATION FONCIERE DU MFOUNDI</Text>
          <Text>LANDS REGISTRERS OFFICE OF MFOUNDI</Text>
          <Text>_______________</Text>
          <Text>LIVRE FONCIER DU DEPARTEMENT du MFOUNDI</Text>
          <Text>REGISTER OF PROPERTY of MFOUNDI</Text>
          <Text>_______________</Text>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>ACTE NOTARIENNE</Text>
          <Text style={styles.subtitle}>NOTARIAL DEED</Text>
          <Text style={styles.referredSection}>
            Mention a la section (Referred to in section): __________
          </Text>
        </View>

        {/* Body */}
        <View style={styles.bodySection}>
          <Text>
            Following the acte No 6175 of the 31/01/2007 received by the undersigned notary {"\n"}
            {data.notary_name} {"\n"}
            {"\n"}
            I therefore stand as a witness that {"\n"}
            Mr {data.seller_name} {"\n"}
            sold his piece of land of size {data.land_size} {"\n"}
            located at {data.land_location} to {"\n"}
            Mr {data.buyer_name} {"\n"}
            for the price of {data.land_price} {"\n"}
            on the {data.present_date} {"\n"}
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.signatureWrapper}>
          {signature ? (
            <Image style={styles.signatures} src={signature} />
          ) : (
            <>
              <Text>No signature available</Text>
              <View style={{ width: '100%', height: '50px' }} />
            </>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default NotarialDeed;

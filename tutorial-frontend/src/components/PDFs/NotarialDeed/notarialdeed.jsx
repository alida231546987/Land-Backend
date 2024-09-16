import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import styles from './notarialdeed.js'; // Import the styles

export const NotarialDeed = ({ data }) => {
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
          <Text style={styles.referredSection}>Mention a la section (Referred to in section): __________</Text>
        </View>

        {/* Body */}
        <View style={styles.bodySection}>
          <Text>
            Following the acte No 6175 of the 31/01/2007 received by the undersigned notary {"\n"}
            {data.notaryName} {"\n"}
            {"\n"}
            I therefore stand as a witness that {"\n"}
            Mr {data.sellerName} {"\n"}
            sold his piece of land of size {data.landSize} {"\n"}
            located at {data.landLocation} to {"\n"}
            Mr {data.buyerName} {"\n"}
            for the price of {data.landPrice} {"\n"}
            on the {data.presentDate} {"\n"}
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatures}>
          <View style={styles.signatureColumn}>
            <Text>Sellers Signature</Text>
            {data.sellerSignature && (
              <Image style={styles.signatureImage} src={data.sellerSignature} />
            )}
          </View>
          <View style={styles.signatureColumn}>
            <Text>Buyers Signature</Text>
            {data.buyerSignature && (
              <Image style={styles.signatureImage} src={data.buyerSignature} />
            )}
          </View>
          <View style={styles.signatureColumn}>
            <Text>Notary Signature</Text>
            {data.notarySignature && (
              <Image style={styles.signatureImage} src={data.notarySignature} />
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default NotarialDeed;

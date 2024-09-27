import React, { useEffect } from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { StyleSheet } from '@react-pdf/renderer';
import landImage from "../../../assets/Land registrer.png";
import logo from "../../../assets/logo.jpeg";

// Define styles for the PDF document
const styles = StyleSheet.create({
  container: {
    padding: 10,
    fontSize: 12,
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
    position: 'relative',
    minHeight: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  col: {
    width: '33%',
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  image: {
    width: 100,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
  },
  signatureWrapper: {
    position: 'absolute',
    bottom: 30, // Adjust as needed
    left: 0,
    right: 0,
    textAlign: 'center',
    width: 200,
    height: 100,
  },
  signature: {
    width: '100%', // Adjust width to fill the wrapper
    height: '100%', // Adjust height to fill the wrapper
    objectFit: 'contain', // Maintain aspect ratio
  },
});

// PDF Document Component
export const CertificateOfOwnership = ({ data, signature, item }) => {
  useEffect(() => {
    if (signature) {
      console.log("Rendering CertifOfOwnership with signature: ", signature);
    } else {
      console.log("No signature provided.");
    }
    if (data) {
      console.log("Rendering COO with data:", data);
    }
  }, [signature, data]);

  const currentDate = new Date().toLocaleString(); // Get the current time

  return (
    <Document>
      <Page style={styles.container}>
        {/* Header */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text>REPUBLIC DU CAMEROUN</Text>
            <Text>Paix-Travail-Patrie</Text>
            <Text>.............</Text>
            <Text>MINISTERE DES DOMAINES DU CADASTRE ET DES AFFAIRES FONCIERES</Text>
            <Text>.............</Text>
            <Text>DELEGATION REGIONAL DU CENTRE</Text>
            <Text>.............</Text>
            <Text>DELEGATION DEPARTEMENTALE DE LA MEFOU ET AFAMBA</Text>
            <Text>.............</Text>
            <Text>CONSERVATION FONCIERES DE LA MEFOU ET AFAMBA</Text>
          </View>
          <View style={styles.col}>
            <Image style={styles.image} src={logo || "../../../assets/logo.jpeg"} />
          </View>
          <View style={styles.col}>
            <Text>REPUBLIC OF CAMEROON</Text>
            <Text>Peace-Work-FatherLand</Text>
            <Text>.............</Text>
            <Text>MINISTRY OF STATE PROPERTY, SURVEYS AND LAND TENURE</Text>
            <Text>.............</Text>
            <Text>REGIONAL DELEGATION OF THE CENTER</Text>
            <Text>.............</Text>
            <Text>DIVISIONAL DELEGATION OF MEFOU AND AFAMBA</Text>
            <Text>.............</Text>
            <Text>LANDS REGISTRATION OFFICE OF MEFOU AND AFAMBA</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>CERTIFICATE OF OWNERSHIP /CP/MINDCAF/2/35/T600</Text>

        {/* Body */}
        <Text>
          The Land Register office of state property and land tenure rights of the Ministry of State Property Survey and Land Tenure undersigned certifies that the land located here at <Text style={styles.bold}>Yaounde</Text> precisely at <Text style={styles.bold}>{item?.Location || "N/A"}</Text> of a surface area of {item?.Size || "N/A"} immatriculated in the Land title register of Cameroon.
        </Text>

        <Text style={styles.centerText}>The owner(s) of this land are:</Text>

        {/* Dynamic Data Section */}
        {data.map((item, index) => (
          <View key={index} style={styles.label}>
            <Text>Owner Name: {item.Owner_name}</Text>
            <Text>Location: {item.Location}</Text>
            <Text>Land Size: {item.Size}</Text>
          </View>
        ))}

        {/* Footer */}
        <Text>
          The owner(s) of this land above acquired this property through the Fragmentation Procedure
          <br />
          This so-called Land title on which a duplicatum <Text style={styles.bold}>No1</Text> has been created  <Text>  {currentDate}</Text> and delivered on this has been withdrawn based on the rigde that stipulates that <Text style={styles.bold}>No 001599/Y.7/MINDCAF/SG/D6 of the 17/9/2023</Text> of MINDCAF concerning the withdrawal of land titles then the establishment of a new land title on the profit of {item?.Owner_name || "N/A"} is a judiciary prenotation following the order <Text style={styles.bold}>No256/2015</Text> of the TPI of the Division of MFOU following the request of {item?.Owner_name || "N/A"} in accordance with the inscriptions of the Land Book of the Land registrars office establish due to the demand of {item?.Owner_name || "N/A"} for information.
        </Text>
        <Text>En foi de quoi the present certificate is been established to serve and valorize its right.</Text>
        <Image style={styles.image} src={landImage || "../tutorial-frontend/src/assets/Land_registrer-removebg-preview.png"} />

        {/* Date and other details */}
        {data.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text>Signature:</Text>
            <Text>Validity: 30 Days</Text>
          </View>
        ))}

        {/* Signature */}
        <View style={styles.signatureWrapper}>
          {signature ? (
            <Image style={styles.signature} src={signature} />
          ) : (
            <>
              <Text>No signature available</Text>
              <View style={{width: '100%', height: '100%' }} />
            </>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default CertificateOfOwnership;

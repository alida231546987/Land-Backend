// AnalyticalSlip.jsx
import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import styles from './analyticslip.js'; // Ensure this file exports a valid styles object

export const AnalyticalSlip = ({ data, signature, item }) => {
  useEffect(() => {
    if (signature) {
      console.log("Rendering Land title with signature: ", signature);
    } else {
      console.log("No signature provided.");
    }
    if (data) {
      console.log("Rendering Land title with data:", data);
    }
  }, [signature, data]);

  // State for dynamic data
  const [slip, setSlip] = useState({
    notaryName: data?.slip?.notaryName || '',
    date: data?.slip?.date || '',
    buyersName: data?.slip?.buyersName || '',
    buyersAddress: data?.slip?.buyersAddress || '',
    dob: data?.slip?.dob || '',
    placeOfBirth: data?.slip?.placeOfBirth || '',
    landId: data?.slip?.landId || '',
    price: data?.slip?.price || '',
    newOwner: data?.slip?.newOwner || '',
    newOwnerProfession: data?.slip?.newOwnerProfession || '',
    newOwnerLocation: data?.slip?.newOwnerLocation || '',
    newOwnerDob: data?.slip?.newOwnerDob || '',
    newOwnerBirthPlace: data?.slip?.newOwnerBirthPlace || '',
    motherName: data?.slip?.motherName || '',
    fatherName: data?.slip?.fatherName || '',
    nationality: data?.slip?.nationality || '',
    quittanceNo: data?.slip?.quittanceNo || '',
    sellersName: data?.slip?.sellersName || ''
  });

  const [propertyDetails, setPropertyDetails] = useState({
    nature: data?.propertyDetails?.nature || '',
    size: data?.propertyDetails?.size || '',
    location: data?.propertyDetails?.location || '',
    coordinates: {
      latitude: data?.propertyDetails?.coordinates?.latitude || '',
      longitude: data?.propertyDetails?.coordinates?.longitude || ''
    }
  });

  const [ownerDetails, setOwnerDetails] = useState({
    fullName: data?.ownerDetails?.fullName || '',
    profession: data?.ownerDetails?.profession || '',
    address: data?.ownerDetails?.address || '',
    dob: data?.ownerDetails?.dob || '',
    fatherName: data?.ownerDetails?.fatherName || '',
    pob: data?.ownerDetails?.pob || '',
    motherName: data?.ownerDetails?.motherName || '',
    deliveryDate: data?.ownerDetails?.deliveryDate || ''
  });

  return (
    <Document>
      {/* Page 1 */}
      <Page style={styles.page1}>
        <View style={styles.borderFrame}>
          <View style={styles.innerFrame} />
          <View>
            <Text style={styles.header}>REPUBLIQUE DU CAMEROUN</Text>
            <Text style={styles.header}>Paix-Travail-Patrie</Text>
            <Text style={styles.header}>REPUBLIC OF CAMEROON</Text>
            <Text style={styles.header}>Peace-Work-FatherLand</Text>
            <Text style={styles.header}>CONSERVATION FONCIER DE</Text>
            <Text style={styles.header}>REGISTRY OF LAND PROPERTY OF __________</Text>
            <Text style={styles.title}>COPIE DU TITRE FONCIER</Text>
            <Text style={styles.title}>COPY OF LAND CERTIFICATE</Text>
            {/* Uncomment and use Image if needed */}
            {/* <Image
              style={styles.image}
              src={landImage}
            /> */}
            <Text style={styles.number}>Land Title Number {slip.landId}</Text>
          </View>
        </View>
      </Page>

      {/* Page 2 */}
      <Page style={styles.page2}>
        <View style={styles.borderFrame}>
          <Text style={styles.header}>Land Id: {slip.landId || '___________'}</Text>
          <Text style={styles.title}>LAND DESCRIPTION</Text>
          <Text style={styles.propertyInfo}>Nature of the Property: {propertyDetails.nature || '___________'}</Text>
          <Text style={styles.propertyInfo}>Land Size: {propertyDetails.size || '__________'}</Text>
          <Text style={styles.propertyInfo}>Land Location: {propertyDetails.location || '_______'}</Text>
          <Text style={styles.propertyInfo}>
            Coordinates: {propertyDetails.coordinates.latitude && propertyDetails.coordinates.longitude
              ? `lat: ${propertyDetails.coordinates.latitude}, long: ${propertyDetails.coordinates.longitude}`
              : '_________'}
          </Text>

          <Text style={styles.ownerInfoHeader}>Land Owner's Information</Text>
          <Text style={styles.propertyInfo}>Full Name: {ownerDetails.fullName || '___________'}</Text>
          <Text style={styles.propertyInfo}>Profession: {ownerDetails.profession || '___________'}</Text>
          <Text style={styles.propertyInfo}>Address: {ownerDetails.address || '_________'}</Text>
          <Text style={styles.propertyInfo}>Date Of Birth: {ownerDetails.dob || '_________'}</Text>
          <Text style={styles.propertyInfo}>Place Of Birth: {ownerDetails.pob || '_____________'}</Text>
          <Text style={styles.propertyInfo}>Father's Name: {ownerDetails.fatherName || '________'}</Text>
          <Text style={styles.propertyInfo}>Mother's Name: {ownerDetails.motherName || '_________'}</Text>
          <Text style={styles.propertyInfo}>Delivery Date: {ownerDetails.deliveryDate || '___________'}</Text>

          {/* Signature */}
          <View style={styles.signatureWrapper}>
            {signature ? (
              <Image style={styles.signature} src={signature} />
            ) : (
              <>
                <Text>No signature available</Text>
                <View style={{ width: '100%', height: '100%' }} />
              </>
            )}
          </View>

          {/* Uncomment and use Image if needed */}
          {/* <Image style={styles.image} src={landImage} /> */}
        </View>
      </Page>

      {/* Page 3 - Empty or add content as needed */}
      <Page></Page>

      {/* Page 4 */}
      <Page style={styles.container}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text>
              B.E.V OFFICE OF{'\n'}
              _________________{'\n'}
              OF{'\n'}
              Vol{'\n'}
              No
            </Text>
          </View>
          <View style={styles.col}>
            <Text>
              REPUBLIC DU CAMEROUN{'\n'}
              REPUBLIC OF CAMEROON{'\n'}
              _______________{'\n'}
              CONSERVATION FONCIERE DU MFOUNDI{'\n'}
              LANDS REGISTRERS OFFICE OF MFOUNDI{'\n'}
              ________________{'\n'}
              LIVRE FONCIER DU DEPARTEMENT du MFOUNDI{'\n'}
              REGISTER OF PROPERTY of MFOUNDI{'\n'}
              ______________{'\n'}
              Titre Foncier No{'\n'}
              Land Certificate No {slip.landId}
            </Text>
          </View>
          <View style={styles.col}>
            <Text>
              ANALYTIC SLIP No{'\n'}
              _______________
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.title}>
            BORDEREAU ANALYTIQUE {'\n'}
            (Abstract of the certificate)
          </Text>
          <Text>
            Mention à la section (Referred to in section){'\n'}
          </Text>
        </View>

        <Text style={{ marginTop: 10 }}>
          Following the acte No 6175 of the 31/01/2007 received by <Text>{slip.notaryName}</Text>, registered at Yaounde CPIC 1 (Civil acte) on the <Text>{slip.date}</Text>, Volume 10 Folio 81 Case and Bd 226/4.{'\n\n'}
          1) <Text>{slip.buyersName}</Text> residing at <Text>{slip.buyersAddress}</Text>, born on <Text>{slip.dob}</Text> at the <Text>{slip.placeOfBirth}</Text>, acting mostly in their personal names and for the account of the other co-dividers of land certificate <Text>{slip.landId}</Text>, in virtue of a procuration given to them by <Text>{slip.sellersName}</Text>, all collective owners of the land certificate No <Text>{slip.landId}</Text> below.{'\n'}
          On the term of a procuration given by them following the acte received by <Text>{slip.notaryName}</Text>, a Notary in Yaounde on <Text>{slip.date}</Text>, registered in Yaounde IV (civil act), Volume "", Folio "", Case and Bd 1254/1.{'\n'}
          All these people stated above sold this piece of land for the amount of {slip.price}.{'\n\n'}
          To <Text>{slip.newOwner}</Text>, <Text>{slip.newOwnerProfession}</Text>, <Text>{slip.newOwnerLocation}</Text>, born on <Text>{slip.newOwnerDob}</Text> at <Text>{slip.newOwnerBirthPlace}</Text>, son/daughter of <Text>{slip.motherName}</Text> and <Text>{slip.fatherName}</Text>, their nationality <Text>{slip.nationality}</Text>.
        </Text>

        <View style={styles.row}>
          <Text>
            Price: {slip.price}
          </Text>
          <Text>
            Quittance: {slip.quittanceNo || '___________'}
          </Text>
          <Text>
            Date: {slip.date || '___________'}
          </Text>
          {/* Uncomment and use Image if needed */}
          {/* <Image style={styles.image} src={landImage} /> */}
        </View>
      </Page>
    </Document>
  );
};

export default AnalyticalSlip;

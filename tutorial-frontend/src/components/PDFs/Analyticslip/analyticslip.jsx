import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import styles from './analyticslip.js'; // Import your styles
//import landImage from "../../../assets/Land registrer.png";
import { SignatureCanvas } from 'react-signature-canvas';




export const AnalyticalSlip = ({data , signature, item}) => {
  useEffect(() => {
    if (signature) {
      console.log("Rendering Land title with signature: ", signature);
    }else{
      console.log("No signature provided.");
    }
    if (data) {
      console.log("Rendering Land title with data:", data);
    }
  }, [signature, data]);
  // State for dynamic data
  const [slip, setSlip] = useState({
    notaryName: '',
    date: '',
    buyersName: '',
    buyersAddress: '',
    dob: '',
    placeOfBirth: '',
    landId: '',
    price: '',
    newOwner: '',
    newOwnerProfession: '',
    newOwnerLocation: '',
    newOwnerDob: '',
    newOwnerBirthPlace: '',
    motherName: '',
    fatherName: '',
    nationality: '',
    quittanceNo: ''
  });

  const [propertyDetails, setPropertyDetails] = useState({
    nature: "Natural",
    size: 3434454,
    location: "Mbanga",
    coordinates: {
      latitude: 5.95959,
      longitude: 4.55545
    }
  })

  const [ownerDetails, setOwnerDetails] = useState({
    fullName: "Super Makia",
    profession: "Arm Wrestler",
    address: "Makia Compound, Makia",
    dob: "1999-01-23",
    fatherName: "Papa Makia",
    pob: "Makia Compound",
    motherName: "Mama Makia",
    deliveryDate: "2022-09-12"
  })
  return (
    <Document>
      <Page style={styles.page1}>
        <   View style={styles.borderFrame}>
          <View style={styles.innerFrame} />
          <View>
            <Text style={styles.header}>REPUBLIQUE DU CAMEROON</Text>
            <Text style={styles.header}>Paix-Travail-Patrie</Text>
            <Text style={styles.header}>REPUBLIC OF CAMEROON</Text>
            <Text style={styles.header}>Peace-Work-FatherLand</Text>
            <Text style={styles.header}>CONSERVATION FONCIER DE</Text>
            <Text style={styles.header}>REGISTRY OF LAND PROPERTY OF______________</Text>
            <Text style={styles.title}>COPIE DU TITRE FONCIER</Text>
            <Text style={styles.title}>COPY OF LAND CERTIFICATE</Text>
            {/* <Image
          style={styles.image}
          src="../tutorial-frontend/src/assets/Land_registrer-removebg-preview.png"
        /> */}
            <Text style={styles.number}>Land Title Number {slip.landId}</Text>
          </View>
        </View>
      </Page>
      <Page style={styles.page2}>
        <View style={styles.borderFrame}>
          <Text style={styles.header}>Land Id: {slip.landId || '___________'}</Text>
          <Text style={styles.title}>LAND DESCRIPTION</Text>
          <Text style={styles.propertyInfo}>Nature of the Property: {propertyDetails.nature || '___________'}</Text>
          <Text style={styles.propertyInfo}>Land Size: {propertyDetails.size || '__________'}</Text>
          <Text style={styles.propertyInfo}>Land Location: {propertyDetails.location || '_______'}</Text>
          <Text style={styles.propertyInfo}>Coordinates: {propertyDetails.coordinates ?  `lat: ${propertyDetails.coordinates.latitude}, long: ${propertyDetails.coordinates.longitude}` :'_________'}</Text>

          <Text style={styles.ownerInfoHeader}>Land Owner's Information</Text>
          <Text style={styles.propertyInfo}>Full Name: {ownerDetails.fullName || '___________'}</Text>
          <Text style={styles.propertyInfo}>Profession: {ownerDetails.profession || '___________'}</Text>
          <Text style={styles.propertyInfo}>Address: {ownerDetails.address || '_________'}</Text>
          <Text style={styles.propertyInfo}>Date Of Birth: {ownerDetails.dob || '_________'}</Text>
          <Text style={styles.propertyInfo}>Place Of Birth: {ownerDetails.pob || '_____________'}</Text>
          <Text style={styles.propertyInfo}>Father's Name: {ownerDetails.fatherName || '________'}</Text>
          <Text style={styles.propertyInfo}>Mother's Name: {ownerDetails.motherName || '_________'}</Text>
          <Text style={styles.propertyInfo}>Delivery date: {ownerDetails.deliveryDate || '___________'}</Text>

          <Text style={styles.signature}>Signature</Text>

          {/* <Image style={styles.image} src={landImage || "../../../assets/Land_registrer-removebg-preview.png"} /> */}

        </View>
      </Page>
      <Page></Page>
      <Page style={styles.container}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text>
              <Text>B.E.V OFFICE OF</Text>
              <Text>_________________</Text>
              <Text>OF</Text>
              <Text>Vol</Text>
              <Text>No</Text>
            </Text>
          </View>
          <View style={styles.col}>
            <Text>
              <Text>REPUBLIC DU CAMEROUN</Text>
              <Text>REPUBLIC OF CAMEROON</Text>
              <Text>_______________</Text>
              <Text>CONSERVATION FONCIERE DU MFOUNDI</Text>
              <Text>LANDS REGISTRERS OFFICE OF MFOUNDI</Text>
              <Text>________________</Text>
              <Text>LIVRE FONCIER DU DEPARTEMENT du MFOUNDI</Text>
              <Text>REGISTER OF PROPERTY of MFOUNDI</Text>
              <Text>______________</Text>
              <Text>Titre Foncier No</Text>
              <Text>Land Certificate No {slip.landId}</Text>
            </Text>
          </View>
          <View style={styles.col}>
            <Text>
              <Text>ANALYTIC SLIP No</Text>
              <Text>_______________</Text>
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.title}>
            BORDEREAU ANALYTIQUE
             (Abstract of the certificate)
          </Text>
          <Text>
            Mention a la section (Referred to in section){' '}
          </Text>
        </View>

        <Text>
          Following the acte No 6175 of the 31/01/2007 received by <Text>{slip.notaryName}</Text>, registered at Yaounde CPIC 1(Civil acte) on the <Text>{slip.date}</Text>, Volume 10 Folio 81 Case and Bd 226/4.
          <br />
          <br />
          1) <Text>{slip.buyersName}</Text> residing at <Text>{slip.buyersAddress}</Text>, born on <Text>{slip.dob}</Text> at the <Text>{slip.placeOfBirth}</Text>
          Acting mostly for their personal names than for the name itself and for the account of the others co-dividers of land certificates <Text>{slip.landId}</Text>, in virtue of a procuration which was given to them by <Text>{slip.sellersName}</Text>
          All collective owners of the land certificates No <Text>{slip.landId}</Text> below.
          On a term of a procuration which was given by them following the acte received by <Text>{slip.notaryName}</Text> a Notary in Yaounde <Text>{slip.date}</Text> registered in Yaounde IV (civil act)
          volume "", Foliio "", Case and Bd 1254/1
          All these people stated above sold this piece of Land for the amount of {slip.price}
          <br />
          <br />
          To <Text>{slip.newOwner}</Text>, <Text>{slip.newOwnerProfession}</Text>, <Text>{slip.newOwnerLocation}</Text>, born on <Text>{slip.newOwnerDob}</Text> at <Text>{slip.newOwnerBirthPlace}</Text>, son/daughter of <Text>{slip.motherName}</Text> and <Text>{slip.fatherName}</Text>, their nationality <Text>{slip.nationality}</Text>.
        </Text>

        <View style={styles.row}>
          <Text>
            Price: {slip.price}
          </Text>
          <Text>
            Quittance: <Text>{slip.quittanceNo}</Text>
          </Text>
          <Text>
            Date: {slip.date}
          </Text>
          {/* <Image style={styles.image} src={landImage || "../tutorial-frontend/src/assets/Land_registrer-removebg-preview.png"} /> */}
        </View>
      </Page>
    </Document>
  );
};

export default AnalyticalSlip;

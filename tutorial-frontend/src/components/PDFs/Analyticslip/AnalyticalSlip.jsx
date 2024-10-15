// AnalyticalSlip.jsx
import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  centerText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  label: {
    marginBottom: 5,
  },
  page1: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 400,
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  borderFrame: {
    border: '5px solid black',
    padding: 20,
    borderRadius: 10,
    position: 'relative',
    width: '80%',
    maxWidth: 1200,
  },
  number: {
    fontSize: 20,
    marginTop: 20,
  },
  innerFrame: {
    borderRadius: 15,
    border: '5px solid transparent',
    backgroundColor: '#fff',
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
  },
  page2: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  borderFrame: {
    border: '5px solid black',
    padding: 20,
    borderRadius: 10,
    position: 'relative',
    width: '80%',
    maxWidth: 1200,
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  propertyInfo: {
    fontSize: 10,
    marginBottom: 10,
  },
  ownerInfoHeader: {
    fontSize: 10,
    marginTop: 20,
    fontWeight: 'bold',
  },
  signature: {
    marginTop: 20,
    fontSize: 20,
  },
  image: {
    width: 400,
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
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
});// Ensure this file exports a valid styles object

export const AnalyticalSlip = ({ data, signature, item }) => {

  // // State for dynamic data
  // const [slip, setSlip] = useState({
  //   notaryName: data?.slip?.notaryName || '',
  //   date: data?.slip?.date || '',
  //   buyersName: data?.slip?.buyersName || '',
  //   buyersAddress: data?.slip?.buyersAddress || '',
  //   dob: data?.slip?.dob || '',
  //   placeOfBirth: data?.slip?.placeOfBirth || '',
  //   landId: data?.slip?.landId || '',
  //   price: data?.slip?.price || '',
  //   newOwner: data?.slip?.newOwner || '',
  //   newOwnerProfession: data?.slip?.newOwnerProfession || '',
  //   newOwnerLocation: data?.slip?.newOwnerLocation || '',
  //   newOwnerDob: data?.slip?.newOwnerDob || '',
  //   newOwnerBirthPlace: data?.slip?.newOwnerBirthPlace || '',
  //   motherName: data?.slip?.motherName || '',
  //   fatherName: data?.slip?.fatherName || '',
  //   nationality: data?.slip?.nationality || '',
  //   quittanceNo: data?.slip?.quittanceNo || '',
  //   sellersName: data?.slip?.sellersName || ''
  // });

  // const [propertyDetails, setPropertyDetails] = useState({
  //   nature: data?.propertyDetails?.nature || '',
  //   size: data?.propertyDetails?.size || '',
  //   location: data?.propertyDetails?.location || '',
  //   coordinates: {
  //     latitude: data?.propertyDetails?.coordinates?.latitude || '',
  //     longitude: data?.propertyDetails?.coordinates?.longitude || ''
  //   }
  // });

  // const [ownerDetails, setOwnerDetails] = useState({
  //   fullName: data?.ownerDetails?.fullName || '',
  //   profession: data?.ownerDetails?.profession || '',
  //   address: data?.ownerDetails?.address || '',
  //   dob: data?.ownerDetails?.dob || '',
  //   fatherName: data?.ownerDetails?.fatherName || '',
  //   pob: data?.ownerDetails?.pob || '',
  //   motherName: data?.ownerDetails?.motherName || '',
  //   deliveryDate: data?.ownerDetails?.deliveryDate || ''
  // });

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
            <Text style={styles.number}>Land Title Number {data[0]?.land_id}</Text>
          </View>
        </View>
      </Page>

      {/* Page 2 */}
      <Page style={styles.page2}>
        <View style={styles.borderFrame}>
          <Text style={styles.header}>Land Id: {data[0]?.land_id || '___________'}</Text>
          <Text style={styles.title}>LAND DESCRIPTION</Text>
          <Text style={styles.propertyInfo}>Nature of the Property: {data[0]?.nature || '___________'}</Text>
          <Text style={styles.propertyInfo}>Land Size: {data[0]?.land_size || '__________'}</Text>
          <Text style={styles.propertyInfo}>Land Location: {data[0]?.land_location || '_______'}</Text>
          <Text style={styles.propertyInfo}>Coordinates:  </Text>
          <Text style={styles.propertyInfo}>{data[0]?.coordinates}</Text>

          <Text style={styles.ownerInfoHeader}>Land Owner's Information</Text>
          <Text style={styles.propertyInfo}>Full Name: {data[0]?.owner_name || '___________'}</Text>
          <Text style={styles.propertyInfo}>Profession: {data[0]?.profession || '___________'}</Text>
          <Text style={styles.propertyInfo}>Address: {data[0]?.address || '_________'}</Text>
          <Text style={styles.propertyInfo}>Date Of Birth: {data[0]?.dob || '_________'}</Text>
          <Text style={styles.propertyInfo}>Place Of Birth: {data[0]?.pob || '_____________'}</Text>
          <Text style={styles.propertyInfo}>Father's Name: {data[0]?.father_name || '________'}</Text>
          <Text style={styles.propertyInfo}>Mother's Name: {data[0]?.mother_name || '_________'}</Text>
          <Text style={styles.propertyInfo}>Delivery Date: {data[0]?.delivery_date || '___________'}</Text>

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
              Land Certificate No {data[0]?.land_id}
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
          Following the acte No 6175 of the 31/01/2007 received by <Text>{data[0]?.notaryName}</Text>, registered at Yaounde CPIC 1 (Civil acte) on the <Text>{data[0]?.date}</Text>, Volume 10 Folio 81 Case and Bd 226/4.{'\n\n'}
          1) <Text>{data[0]?.buyersName}</Text> residing at <Text>{data[0]?.buyersAddress}</Text>, born on <Text>{data[0]?.dob}</Text> at the <Text>{data[0]?.placeOfBirth}</Text>, acting mostly in their personal names and for the account of the other co-dividers of land certificate <Text>{data[0]?.land_id}</Text>, in virtue of a procuration given to them by <Text>{data[0]?.sellersName}</Text>, all collective owners of the land certificate No <Text>{data[0]?.land_id}</Text> below.{'\n'}
          On the term of a procuration given by them following the acte received by <Text>{data[0]?.notaryName}</Text>, a Notary in Yaounde on <Text>{data[0]?.date}</Text>, registered in Yaounde IV (civil act), Volume "", Folio "", Case and Bd 1254/1.{'\n'}
          All these people stated above sold this piece of land for the amount of {data[0]?.price}.{'\n\n'}
          To <Text>{data[0]?.newOwner}</Text>, <Text>{data[0]?.newOwnerProfession}</Text>, <Text>{data[0]?.newOwnerLocation}</Text>, born on <Text>{data[0]?.newOwnerDob}</Text> at <Text>{data[0]?.newOwnerBirthPlace}</Text>, son/daughter of <Text>{data[0]?.motherName}</Text> and <Text>{data[0]?.fatherName}</Text>, their nationality <Text>{data[0]?.nationality}</Text>.
        </Text>

        <View style={styles.row}>
          <Text>
            Price: {data[0]?.price}
          </Text>
          <Text>
            Quittance: {data[0]?.quittanceNo || '___________'}
          </Text>
          <Text>
            Date: {data[0]?.delivery_date || '___________'}
          </Text>
          {/* Uncomment and use Image if needed */}
          {/* <Image style={styles.image} src={landImage} /> */}
        </View>
      </Page>
    </Document>
  );
};

export default AnalyticalSlip;

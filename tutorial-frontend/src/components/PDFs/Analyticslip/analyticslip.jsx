import React, { useState } from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import styles from './analyticslip.js'; // Import your styles

export const AnalyticalSlip = () => {
  // State for dynamic data
  const [data, setData] = useState({
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

  return (
    <Document>
      <Page style={styles.container}>
        {/* Header */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text>
              <b>B.E.V OFFICE OF</b>
              <Text>_________________</Text>
              <Text>OF</Text>
              <Text>Vol</Text>
              <Text>No</Text>
            </Text>
          </View>
          <View style={styles.col}>
            <Text>
              <b>REPUBLIC DU CAMEROUN</b>
              <Text>REPUBLIC OF CAMEROON</Text>
              <Text>_______________</Text>
              <Text>CONSERVATION FONCIERE DU MFOUNDI</Text>
              <Text>LANDS REGISTRERS OFFICE OF MFOUNDI</Text>
              <Text>________________</Text>
              <Text>LIVRE FONCIER DU DEPARTEMENT du MFOUNDI</Text>
              <Text>REGISTER OF PROPERTY of MFOUNDI</Text>
              <Text>______________</Text>
              <Text>Titre Foncier No</Text>
              <Text><i>Land Certificate</i> No {data.landId}</Text>
            </Text>
          </View>
          <View style={styles.col}>
            <Text>
              <b>ANALYTIC SLIP No</b>
              <Text>_______________</Text>
            </Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.row}>
          <Text style={styles.title}>
            <b>BORDEREAU ANALYTIQUE</b>
            <i> (Abstract of the certificate)</i>
          </Text>
          <Text>
            <h5>Mention a la section <i>(Referred to in section)</i>{' '}</h5>
          </Text>
        </View>

        {/* Body */}
        <Text>
          Following the acte No 6175 of the 31/01/2007 received by <Text>{data.notaryName}</Text>, registered at Yaounde CPIC 1(Civil acte) on the <Text>{data.date}</Text>, Volume 10 Folio 81 Case and Bd 226/4.
          <br />
          <br />
          1) <Text>{data.buyersName}</Text> residing at <Text>{data.buyersAddress}</Text>, born on <Text>{data.dob}</Text> at the <Text>{data.placeOfBirth}</Text>
          Acting mostly for their personal names than for the name itself and for the account of the others co-dividers of land certificates <Text>{data.landId}</Text>, in virtue of a procuration which was given to them by <Text>{data.sellersName}</Text>
          All collective owners of the land certificates No <Text>{data.landId}</Text> below.
          On a term of a procuration which was given by them following the acte received by <Text>{data.notaryName}</Text> a Notary in Yaounde <Text>{data.date}</Text> registered in Yaounde IV (civil act)
          volume "", Foliio "", Case and Bd 1254/1
          All these people stated above sold this piece of Land for the amount of <b>{data.price}</b>
          <br />
          <br />
          To <Text>{data.newOwner}</Text>, <Text>{data.newOwnerProfession}</Text>, <Text>{data.newOwnerLocation}</Text>, born on <Text>{data.newOwnerDob}</Text> at <Text>{data.newOwnerBirthPlace}</Text>, son/daughter of <Text>{data.motherName}</Text> and <Text>{data.fatherName}</Text>, their nationality <Text>{data.nationality}</Text>.
        </Text>

        {/* Footer */}
        <View style={styles.row}>
          <Text>
            Price: <b>{data.price}</b>
          </Text>
          <Text>
            Quittance: <Text>{data.quittanceNo}</Text>
          </Text>
          <Text>
            Date: {data.date}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default AnalyticalSlip;

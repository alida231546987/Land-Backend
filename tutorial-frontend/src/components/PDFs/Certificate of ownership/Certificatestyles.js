// CertificateStyles.js
import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    fontSize: 12,
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
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
    width: 250,
    marginTop: 20,
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
  signatureContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signature: {
    width: 200,
    height: 50,
  },
  
});

export default styles;

// ./PDFs/NotarialDeed/notarialdeed.js
import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  referredSection: {
    fontSize: 12,
    marginTop: 5,
  },
  bodySection: {
    marginTop: 20,
    lineHeight: 1.5,
  },
  signatureWrapper: {
    marginTop: 30,
    alignItems: 'flex-end',
  },
  signatures: {
    width: 200,
    height: 50,
  },
});

export default styles;

import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    textAlign: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  referredSection: {
    fontSize: 12,
    marginBottom: 20,
  },
  bodySection: {
    marginBottom: 20,
  },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  signatureColumn: {
    flex: 1,
    alignItems: 'center',
  },
  signatureImage: {
    width: 100,
    height: 50,
    marginTop: 5,
    border: '1px solid black', // Optional: to visualize the boundary of the image
  },
});

export default styles;

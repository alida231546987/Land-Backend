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
    fontSize: 18,
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
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 30,
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
    fontSize: 50,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 20,
  },
  propertyInfo: {
    fontSize: 20,
    marginBottom: 10,
  },
  ownerInfoHeader: {
    fontSize: 30,
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
});

export default styles;

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
});

export default styles;

import { CSSProperties } from 'react';
// import { Nunito } from '@next/fonts/';
import { startCase, lowerCase, capitalize } from 'lodash';
import dayjs from 'dayjs';
import { numberFormat } from '@grc/_shared/helpers';

// const nunito = Nunito({
//   subsets: ['latin'],
//   display: 'swap',
// });

interface TeplateProps {
  successData: Record<string, any>;
}
export const Template = ({ successData }: TeplateProps) => {
  const {
    amount,
    accountName,
    accountNumber,
    beneficiary,
    bankName,
    date,
    reference,
    status,
    entry,
    narration,
  } = successData ?? {};
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '500px',
      height: '590px',
      position: 'relative',
      // fontFamily: `${nunito.className}`,
      color: 'black',
    } as CSSProperties,
    contentContainer: {
      width: '500px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '10px',
      padding: '5px 15px 20px 15px',
      fontSize: '1rem',
      color: 'black',
    } as CSSProperties,
    title: {
      fontFamily: 'Anton, Anton-Regular',
      fontSize: '1rem',
      fontWeight: 'Bold',
      color: 'black',
      textAlign: 'center',
      width: '100%',
      padding: '0 0 10px 0',
    } as CSSProperties,
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '12px 0px',
      fontSize: '1rem',
      borderBottom: '0.5px solid grey',
    } as CSSProperties,
    footer: {
      position: 'absolute',
      bottom: '60px',
      width: '100%',
      padding: '10px 0px',
      textAlign: 'center',
      fontSize: '1.3rem',
      display: 'block',
    } as CSSProperties,
    footerSupportEmailWrapper: {
      borderBottom: '1px',
      borderBottomStyle: 'dashed',
      padding: '0px 0px 5px 0px',
      marginBottom: '5px',
      wordSpacing: '0 !important',
    } as CSSProperties,
    wordSpacing: {
      wordSpacing: '3px',
    } as CSSProperties,
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Transaction Receipt</h1>
      <div style={styles.contentContainer}>
        <div style={styles.row}>
          <span style={styles.wordSpacing}>{entry === 'credit' ? 'Source' : 'Recipient'} Name</span>
          <span style={styles.wordSpacing}>{startCase(lowerCase(accountName))}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.wordSpacing}>
            {entry === 'credit' ? 'Source' : 'Recipient'} Account Number
          </span>
          <span style={styles.wordSpacing}>{accountNumber}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.wordSpacing}>
            {entry === 'credit' ? 'Source' : 'Recipient'} Bank Name
          </span>
          <span style={styles.wordSpacing}>
            {startCase(lowerCase(beneficiary?.bankName || bankName))}
          </span>
        </div>
        <div style={styles.row}>
          <span style={styles.wordSpacing}>Amount Received</span>
          <span style={styles.wordSpacing}>N{numberFormat(amount / 100) ?? 0}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.wordSpacing}>Transaction Status</span>
          <span style={styles.wordSpacing}>{startCase(lowerCase(status))}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.wordSpacing}>Transaction Time</span>
          <span style={styles.wordSpacing}>{dayjs(date).format('YYYY-MM-DD hh:mm:ss')}</span>
        </div>
        {/* <div style={styles.row}>
          <span style={styles.wordSpacing}>Transaction Status</span>
          <span style={styles.wordSpacing}>{startCase(lowerCase(status))}</span>
        </div> */}

        <div style={styles.row}>
          <span style={styles.wordSpacing}>Transaction Reference</span>
          <span style={styles.wordSpacing}>{reference}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.wordSpacing}>Narration</span>
          <span style={styles.wordSpacing}>{capitalize(lowerCase(narration))}</span>
        </div>
      </div>
      <div style={styles.footer}>
        <div>Support</div>
        <pre style={styles.footerSupportEmailWrapper}>support@girostack.com</pre>
        <pre style={{ ...styles.wordSpacing, width: '100%' }}>
          Contact support for more information
        </pre>
      </div>
    </div>
  );
};

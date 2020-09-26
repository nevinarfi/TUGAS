/* eslint-disable react/jsx-sort-props */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import format from 'date-fns/format';
import { Grid, Row, Col, Image, Button } from '@freecodecamp/react-bootstrap';
import FreeCodeCampLogo from '../assets/icons/freeCodeCampLogo';
// eslint-disable-next-line max-len
import MinimalDonateForm from '../components/Donation/MinimalDonateForm';

import {
  showCertSelector,
  showCertFetchStateSelector,
  showCert,
  userFetchStateSelector,
  usernameSelector,
  isDonatingSelector,
  executeGA
} from '../redux';
import { createFlashMessage } from '../components/Flash/redux';
import standardErrorMessage from '../utils/standardErrorMessage';
import reallyWeirdErrorMessage from '../utils/reallyWeirdErrorMessage';

import RedirectHome from '../components/RedirectHome';
import { Loader, Spacer } from '../components/helpers';

const propTypes = {
  cert: PropTypes.shape({
    username: PropTypes.string,
    name: PropTypes.string,
    certName: PropTypes.string,
    certTitle: PropTypes.string,
    completionTime: PropTypes.number,
    date: PropTypes.number
  }),
  certDashedName: PropTypes.string,
  certName: PropTypes.string,
  createFlashMessage: PropTypes.func.isRequired,
  executeGA: PropTypes.func,
  fetchState: PropTypes.shape({
    pending: PropTypes.bool,
    complete: PropTypes.bool,
    errored: PropTypes.bool
  }),
  isDonating: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  showCert: PropTypes.func.isRequired,
  signedInUserName: PropTypes.string,
  userFetchState: PropTypes.shape({
    complete: PropTypes.bool
  }),
  userFullName: PropTypes.string,
  username: PropTypes.string,
  validCertNames: PropTypes.arrayOf(PropTypes.string)
};

const mapStateToProps = () => {
  return createSelector(
    showCertSelector,
    showCertFetchStateSelector,
    usernameSelector,
    userFetchStateSelector,
    isDonatingSelector,
    (cert, fetchState, signedInUserName, userFetchState, isDonating) => ({
      cert,
      fetchState,
      signedInUserName,
      userFetchState,
      isDonating
    })
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ createFlashMessage, showCert, executeGA }, dispatch);

// function propComparator(currentProps, nextProps) {
//   const {
//     userFetchState: { complete: userComplete },
//     signedInUserName,
//     isDonating,
//     cert: { username = '' },
//     executeGA
//   } = nextProps;
//   const { isDonationDisplayed } = currentProps;

//   if (
//     !isDonationDisplayed &&
//     userComplete &&
//     signedInUserName &&
//     signedInUserName === username &&
//     !isDonating
//   ) {
//     setIsDonationDisplayed(true);

//     executeGA({
//       type: 'event',
//       data: {
//         category: 'Donation',
//         action: 'Displayed Certificate Donation',
//         nonInteraction: true
//       }
//     });
//   }
//   return false;
// }

const ShowCertification = props => {
  const [isDonationSubmitted, setIsDonationSubmitted] = useState(false);
  const [isDonationDisplayed, setIsDonationDisplayed] = useState(false);
  const [isDonationClosed, setIsDonationClosed] = useState(false);

  useEffect(() => {
    const { username, certName, validCertNames, showCert } = props;
    if (validCertNames.some(name => name === certName)) {
      return showCert({ username, certName });
    }
    return null;
  }, [props]);

  useEffect(() => {
    const {
      userFetchState: { complete: userComplete },
      signedInUserName,
      isDonating,
      cert: { username = '' },
      executeGA
    } = props;

    if (
      !isDonationDisplayed &&
      userComplete &&
      signedInUserName &&
      signedInUserName === username &&
      !isDonating
    ) {
      setIsDonationDisplayed(true);

      executeGA({
        type: 'event',
        data: {
          category: 'Donation',
          action: 'Displayed Certificate Donation',
          nonInteraction: true
        }
      });
    }
    console.log('Rendered');
  }, [isDonationDisplayed, props]);

  const hideDonationSection = () => {
    setIsDonationDisplayed(false);
    setIsDonationClosed(false);
  };

  const handleProcessing = (
    duration,
    amount,
    action = 'stripe form submission'
  ) => {
    props.executeGA({
      type: 'event',
      data: {
        category: 'donation',
        action: `certificate ${action}`,
        label: duration,
        value: amount
      }
    });
    setIsDonationSubmitted(true);
  };

  const {
    cert,
    fetchState,
    validCertNames,
    certName,
    createFlashMessage,
    signedInUserName,
    location: { pathname }
  } = props;

  if (!validCertNames.some(name => name === certName)) {
    createFlashMessage(standardErrorMessage);
    return <RedirectHome />;
  }

  const { pending, complete, errored } = fetchState;

  if (pending) {
    return <Loader fullScreen={true} />;
  }

  if (!pending && errored) {
    createFlashMessage(standardErrorMessage);
    return <RedirectHome />;
  }

  if (!pending && !complete && !errored) {
    createFlashMessage(reallyWeirdErrorMessage);
    return <RedirectHome />;
  }

  const {
    date: issueDate,
    name: userFullName,
    username,
    certTitle,
    completionTime
  } = cert;

  const certDate = new Date(issueDate);
  const certYear = certDate.getFullYear();
  const certMonth = certDate.getMonth();
  const certURL = `https://freecodecamp.org${pathname}`;

  const donationCloseBtn = (
    <div>
      <Button
        block={true}
        bsSize='sm'
        bsStyle='primary'
        onClick={hideDonationSection}
      >
        Close
      </Button>
    </div>
  );

  let donationSection = (
    <Grid className='donation-section'>
      {!isDonationSubmitted && (
        <Row>
          <Col lg={8} lgOffset={2} sm={10} smOffset={1} xs={12}>
            <p>
              Only you can see this message. Congratulations on earning this
              certification. It’s no easy task. Running freeCodeCamp isn’t easy
              either. Nor is it cheap. Help us help you and many other people
              around the world. Make a tax-deductible supporting donation to our
              nonprofit today.
            </p>
          </Col>
        </Row>
      )}
      <MinimalDonateForm
        handleProcessing={handleProcessing}
        defaultTheme='light'
      />
      <Row>
        <Col sm={4} smOffset={4} xs={6} xsOffset={3}>
          {isDonationSubmitted && donationCloseBtn}
        </Col>
      </Row>
    </Grid>
  );

  const shareCertBtns = (
    <Row className='text-center'>
      <Spacer size={2} />
      <Button
        block={true}
        bsSize='lg'
        bsStyle='primary'
        target='_blank'
        href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certTitle}&organizationId=4831032&issueYear=${certYear}&issueMonth=${certMonth}&certUrl=${certURL}`}
      >
        Add this certification to my LinkedIn profile
      </Button>
      <Spacer />
      <Button
        block={true}
        bsSize='lg'
        bsStyle='primary'
        target='_blank'
        href={`https://twitter.com/intent/tweet?text=I just earned the ${certTitle} certification @freeCodeCamp! Check it out here: ${certURL}`}
      >
        Share this certification on Twitter
      </Button>
    </Row>
  );

  return (
    <div className='certificate-outer-wrapper'>
      {isDonationDisplayed && !isDonationClosed ? donationSection : ''}
      <Grid className='certificate-wrapper certification-namespace'>
        <Row>
          <header>
            <Col md={5} sm={12}>
              <div className='logo'>
                <FreeCodeCampLogo />
              </div>
            </Col>
            <Col md={7} sm={12}>
              <div className='issue-date'>
                Issued&nbsp;
                <strong>{format(certDate, 'MMMM D, YYYY')}</strong>
              </div>
            </Col>
          </header>

          <main className='information'>
            <div className='information-container'>
              <h3>This certifies that</h3>
              <h1>
                <strong>{userFullName}</strong>
              </h1>
              <h3>has successfully completed the freeCodeCamp.org</h3>
              <h1>
                <strong>{certTitle}</strong>
              </h1>
              <h4>
                Developer Certification, representing approximately{' '}
                {completionTime} hours of coursework
              </h4>
            </div>
          </main>
          <footer>
            <div className='row signatures'>
              <Image
                alt="Quincy Larson's Signature"
                src={
                  'https://cdn.freecodecamp.org' +
                  '/platform/english/images/quincy-larson-signature.svg'
                }
              />
              <p>
                <strong>Quincy Larson</strong>
              </p>
              <p>Executive Director, freeCodeCamp.org</p>
            </div>
            <Row>
              <p className='verify'>Verify this certification at {certURL}</p>
            </Row>
          </footer>
        </Row>
      </Grid>
      {signedInUserName === username ? shareCertBtns : ''}
    </div>
  );
};

ShowCertification.displayName = 'ShowCertification';
ShowCertification.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowCertification);
// )(React.memo(ShowCertification, propComparator));

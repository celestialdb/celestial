import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import { useGetCurrentUserQuery } from 'celestial/usersData';
import { useGetProjectQuery } from 'celestial/projectsData';
import { useGetCommentsQuery } from 'celestial/commentsData';
import { useGetIssuesQuery } from 'celestial/issuesData';
import NormalizeStyles from './NormalizeStyles';
import BaseStyles from './BaseStyles';
import Toast from './Toast';
import Routes from './Routes';

// We're importing .css because @font-face in styled-components causes font files
// to be constantly re-requested from the server (which causes screen flicker)
// https://github.com/styled-components/styled-components/issues/1593
import './fontStyles.css';

const App = () => {
  useGetIssuesQuery();
  useGetCommentsQuery();
  useGetProjectQuery();
  useGetCurrentUserQuery();

  console.log(
    '---- state after rtk query: ',
    useSelector(state => state),
  );

  return (
    <Fragment>
      <NormalizeStyles />
      <BaseStyles />
      <Toast />
      <Routes />
    </Fragment>
  );
};

export default App;

import React from 'react';
import { Router, Routes, Route, Navigate } from 'react-router-dom';

import history from 'browserHistory';
import Project from 'Project';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';

const RoutesLocal = () => (
  <Router history={history}>
    <Routes>
      <Navigate exact from="/" to="/project" />
      <Route path="/authenticate" component={Authenticate} />
      <Route path="/project" component={Project} />
      <Route component={PageError} />
    </Routes>
  </Router>
);

export default RoutesLocal;

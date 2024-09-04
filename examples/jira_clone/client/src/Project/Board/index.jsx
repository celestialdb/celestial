import React, { Fragment } from 'react';
// import { Route, useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Breadcrumbs } from 'shared/components';
// import { Modal } from 'shared/components';

import Header from './Header';
import Filters from './Filters';
import Lists from './Lists';
// import IssueDetails from './IssueDetails';

import { selectCurrentProject } from '../../utils/selectors';

const ProjectBoard = () => {
  // const match = useRouteMatch();
  // const history = useHistory();

  const project = useSelector(state => selectCurrentProject(state));
  // const projectUsers = useSelector(state => selectProjectUsers(state)) || [];

  // const [filters, mergeFilters] = useMergeState(defaultFilters);

  return (
    <Fragment>
      <Breadcrumbs items={['Projects', project.name, 'Kanban Board']} />
      <Header />
      <Filters />
      <Lists />
      {/* <Route */}
      {/*  path={`${match.path}/issues/:issueId`} */}
      {/*  render={routeProps => ( */}
      {/*    <Modal */}
      {/*      isOpen */}
      {/*      testid="modal:issue-details" */}
      {/*      width={1040} */}
      {/*      withCloseIcon={false} */}
      {/*      onClose={() => history.push(match.url)} */}
      {/*      renderContent={modal => ( */}
      {/*        <IssueDetails */}
      {/*          issueId={routeProps.match.params.issueId} */}
      {/*          projectUsers={project.users} */}
      {/*          fetchProject={fetchProject} */}
      {/*          updateLocalProjectIssues={updateLocalProjectIssues} */}
      {/*          modalClose={modal.close} */}
      {/*        /> */}
      {/*      )} */}
      {/*    /> */}
      {/*  )} */}
      {/* /> */}
    </Fragment>
  );
};

export default ProjectBoard;

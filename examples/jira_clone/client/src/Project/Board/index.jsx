import React, { Fragment } from 'react';
import { Route, useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Breadcrumbs, Modal } from 'shared/components';

import { selectCurrentProject } from 'utils/selectors';
import Header from './Header';
import Filters from './Filters';
import Lists from './Lists';
import IssueDetails from './IssueDetails';

const ProjectBoard = () => {
  const match = useRouteMatch();
  const history = useHistory();

  const project = useSelector(state => selectCurrentProject(state));

  return (
    <Fragment>
      <Breadcrumbs items={['Projects', project.name, 'Kanban Board']} />
      <Header />
      <Filters />
      <Lists />
      <Route
        path={`${match.path}/issues/:issueId`}
        render={routeProps => (
          <Modal
            isOpen
            testid="modal:issue-details"
            width={1040}
            withCloseIcon={false}
            onClose={() => history.push(match.url)}
            renderContent={modal => (
              <IssueDetails issueId={routeProps.match.params.issueId} modalClose={modal.close} />
            )}
          />
        )}
      />
    </Fragment>
  );
};

export default ProjectBoard;

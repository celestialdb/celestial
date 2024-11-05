import React from 'react';
import { Route, Redirect, useRouteMatch, useHistory } from 'react-router-dom';

import { createQueryParamModalHelpers } from 'shared/utils/queryParamModal';
import { Modal } from 'shared/components';

import { useSelector } from 'react-redux';
import NavbarLeft from './NavbarLeft';
import Sidebar from './Sidebar';
import Board from './Board';
import IssueSearch from './IssueSearch';
import IssueCreate from './IssueCreate';
import ProjectSettings from './ProjectSettings';
import { ProjectPage } from './Styles';
import { selectCurrentProject } from '../utils/selectors';

const Project = () => {
  const match = useRouteMatch();
  const history = useHistory();
  //
  const issueSearchModalHelpers = createQueryParamModalHelpers('issue-search');
  const issueCreateModalHelpers = createQueryParamModalHelpers('issue-create');

  // const [{ data, error, setLocalData }, fetchProject] = useApi.get('/projectOld');
  const project = useSelector(state => selectCurrentProject(state));

  // if (!data) return <PageLoader />;
  // if (error) return <PageError />;

  /* const updateLocalProjectIssues = (issueId, updatedFields) => {
    setLocalData(currentData => ({
      project: {
        ...currentData.project,
        issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
      },
    }));
  }; */

  return (
    <ProjectPage>
      <NavbarLeft
        issueSearchModalOpen={issueSearchModalHelpers.open}
        issueCreateModalOpen={issueCreateModalHelpers.open}
      />

      <Sidebar project={project} />

      {issueSearchModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-search"
          variant="aside"
          width={600}
          onClose={issueSearchModalHelpers.close}
          renderContent={() => <IssueSearch project={project} />}
        />
      )}

      {issueCreateModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-create"
          width={800}
          withCloseIcon={false}
          onClose={issueCreateModalHelpers.close}
          renderContent={modal => (
            <IssueCreate
              project={project}
              onCreate={() => history.push(`${match.url}/board`)}
              modalClose={modal.close}
            />
          )}
        />
      )}

      <Route path={`${match.path}/board`} render={() => <Board />} />

      <Route path={`${match.path}/settings`} render={() => <ProjectSettings project={project} />} />

      {match.isExact && <Redirect to={`${match.url}/board`} />}
    </ProjectPage>
  );
};

export default Project;

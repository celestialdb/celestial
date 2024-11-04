import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { CopyLinkButton, Button, AboutTooltip } from 'shared/components';

import { useSelector } from 'react-redux';
import { selectIssuesById } from 'celestial/issuesData';
import Type from './Type';
import Delete from './Delete';
import Title from './Title';
import Description from './Description';
import Comments from './Comments';
import Status from './Status';
import AssigneesReporter from './AssigneesReporter';
import Priority from './Priority';
import EstimateTracking from './EstimateTracking';
import Dates from './Dates';
import { TopActions, TopActionsRight, Content, Left, Right } from './Styles';

const propTypes = {
  issueId: PropTypes.string.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetails = ({ issueId, modalClose }) => {
  const issue = useSelector(state => selectIssuesById(state, issueId)) || {};

  /* const updateLocalIssueDetails = fields =>
  setLocalData(currentData => ({ issue: { ...currentData.issue, ...fields } }));
  const updateIssue = updatedFields => {
    putIssue({issueId, issueInput: updatedFields});
    api.optimisticUpdate(`/issues/${issueId}`, {
      updatedFields,
      currentFields: issue,
      setLocalData: fields => {
        updateLocalIssueDetails(fields);
        updateLocalProjectIssues(issue.id, fields);
      },
    });
  }; */

  // TODO: issue update, comment update not causing rerender
  // probably because selector that feeds that data not updating
  return (
    <Fragment>
      <TopActions>
        <Type issue={issue} />
        <TopActionsRight>
          <AboutTooltip
            renderLink={linkProps => (
              <Button icon="feedback" variant="empty" {...linkProps}>
                Give feedback
              </Button>
            )}
          />
          <CopyLinkButton variant="empty" />
          <Delete issue={issue} modalClose={modalClose} />
          <Button icon="close" iconSize={24} variant="empty" onClick={modalClose} />
        </TopActionsRight>
      </TopActions>
      <Content>
        <Left>
          <Title issue={issue} />
          <Description issue={issue} />
          <Comments issue={issue} />
        </Left>
        <Right>
          <Status issue={issue} />
          <AssigneesReporter issue={issue} />
          <Priority issue={issue} />
          <EstimateTracking issue={issue} />
          <Dates issue={issue} />
        </Right>
      </Content>
    </Fragment>
  );
};

ProjectBoardIssueDetails.propTypes = propTypes;

export default ProjectBoardIssueDetails;

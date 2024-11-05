import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';

import { IssueTypeIcon, IssuePriorityIcon } from 'shared/components';

import { useSelector } from 'react-redux';
import { selectIssuesById, selectUsers, selectIssueAssigneesById } from 'celestial';
import { IssueLink, Issue, Title, Bottom, Assignees, AssigneeAvatar } from './Styles';

const propTypes = {
  index: PropTypes.number.isRequired,
  issueId: PropTypes.number.isRequired,
};

const ProjectBoardListIssue = ({ index, issueId }) => {
  const match = useRouteMatch();

  const issuex = useSelector(state => selectIssuesById(state, issueId) || {});
  const assigneeIds =
    useSelector(state => selectIssueAssigneesById(state, issueId) || {}).userIds || [];
  // select users that match assigneeIds
  const users = useSelector(state => selectUsers(state));
  const assignees = Object.values(assigneeIds).map(id => users.find(user => user.id === id) || []);

  return (
    <Draggable draggableId={issueId.toString()} index={index}>
      {(provided, snapshot) => (
        <IssueLink
          to={`${match.url}/issues/${issuex.id}`}
          ref={provided.innerRef}
          data-testid="list-issue"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Issue isBeingDragged={snapshot.isDragging && !snapshot.isDropAnimating}>
            <Title>{issuex.title}</Title>
            <Bottom>
              <div>
                <IssueTypeIcon type={issuex.type} />
                <IssuePriorityIcon priority={issuex.priority} top={-1} left={4} />
              </div>
              <Assignees>
                {assignees.map(user => (
                  <AssigneeAvatar
                    key={user.id}
                    size={24}
                    avatarUrl={user.avatarUrl}
                    name={user.name}
                  />
                ))}
              </Assignees>
            </Bottom>
          </Issue>
        </IssueLink>
      )}
    </Draggable>
  );
};

ProjectBoardListIssue.propTypes = propTypes;

export default ProjectBoardListIssue;

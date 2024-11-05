import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { moveItemWithinArray, insertItemIntoArray } from 'shared/utils/javascript';
import { IssueStatus } from 'shared/constants/issues';

import { useSelector } from 'react-redux';
import { usePutIssuesByIssueIdMutation } from 'celestial';
import List from './List';
import { Lists } from './Styles';
import { selectProjectIssues } from '../../../utils/selectors';

const ProjectBoardLists = () => {
  const [updateIssue] = usePutIssuesByIssueIdMutation();
  const issues = useSelector(state => selectProjectIssues(state)) || {};

  const handleIssueDrop = ({ draggableId, destination, source }) => {
    if (!isPositionChanged(source, destination)) return;

    const issueId = Number(draggableId);

    // api.optimisticUpdate(`/issues/${issueId}`, {
    //   updatedFields: {
    //     status: destination.droppableId,
    //     listPosition: calculateIssueListPosition(project.issues, destination, source, issueId),
    //   },
    //   currentFields: project.issues.find(({ id }) => id === issueId),
    //   setLocalData: fields => updateLocalProjectIssues(issueId, fields),
    // });

    updateIssue({
      issueId,
      issueInput: {
        status: destination.droppableId,
        listPosition: calculateIssueListPosition(issues, destination, source, issueId),
      },
    });
  };

  return (
    <DragDropContext onDragEnd={handleIssueDrop}>
      <Lists>
        {Object.values(IssueStatus).map(status => (
          <List key={status} status={status} />
        ))}
      </Lists>
    </DragDropContext>
  );
};

const isPositionChanged = (destination, source) => {
  if (!destination) return false;
  const isSameList = destination.droppableId === source.droppableId;
  const isSamePosition = destination.index === source.index;
  return !isSameList || !isSamePosition;
};

const calculateIssueListPosition = (...args) => {
  const { prevIssue, nextIssue } = getAfterDropPrevNextIssue(...args);
  let position;

  if (!prevIssue && !nextIssue) {
    position = 1;
  } else if (!prevIssue) {
    position = nextIssue.listPosition - 1;
  } else if (!nextIssue) {
    position = prevIssue.listPosition + 1;
  } else {
    position = prevIssue.listPosition + (nextIssue.listPosition - prevIssue.listPosition) / 2;
  }
  return position;
};

const getAfterDropPrevNextIssue = (allIssues, destination, source, droppedIssueId) => {
  const beforeDropDestinationIssues = getSortedListIssues(allIssues, destination.droppableId);
  const droppedIssue = allIssues.find(issue => issue.id === droppedIssueId);
  const isSameList = destination.droppableId === source.droppableId;

  const afterDropDestinationIssues = isSameList
    ? moveItemWithinArray(beforeDropDestinationIssues, droppedIssue, destination.index)
    : insertItemIntoArray(beforeDropDestinationIssues, droppedIssue, destination.index);

  return {
    prevIssue: afterDropDestinationIssues[destination.index - 1],
    nextIssue: afterDropDestinationIssues[destination.index + 1],
  };
};

const getSortedListIssues = (issues, status) =>
  issues.filter(issue => issue.status === status).sort((a, b) => a.listPosition - b.listPosition);

export default ProjectBoardLists;

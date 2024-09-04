import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { IssueStatusCopy } from 'shared/constants/issues';

import { useSelector } from 'react-redux';
import { selectIssues } from 'celestial/issuesData';
import { selectFilteredIssues } from 'utils/selectors';
import Issue from './Issue';
import { List, Title, IssuesCount, Issues } from './Styles';

const ProjectBoardList = ({ status }) => {
  const allIssues = useSelector(state => selectIssues(state));
  const filteredIssues = useSelector(state => selectFilteredIssues(state)); // filterIssues(allIssues, filters, currentUserId);
  const filteredListIssues = getSortedListIssues(filteredIssues, status);
  const allListIssues = getSortedListIssues(allIssues, status);

  return (
    <Droppable key={status} droppableId={status}>
      {provided => (
        <List>
          <Title>
            {`${IssueStatusCopy[status]} `}
            <IssuesCount>{formatIssuesCount(allListIssues, filteredListIssues)}</IssuesCount>
          </Title>
          <Issues
            {...provided.droppableProps}
            ref={provided.innerRef}
            data-testid={`board-list:${status}`}
          >
            {filteredListIssues.map((issue, index) => (
              <Issue key={issue.id} index={index} issueId={issue.id} />
            ))}
            {provided.placeholder}
          </Issues>
        </List>
      )}
    </Droppable>
  );
};

// const filterIssues = (projectIssues, filters, currentUserId) => {
//   const { searchTerm, userIds, myOnly, recent } = filters;
//   let issues = projectIssues;
//
//   if (searchTerm) {
//     issues = issues.filter(issue => issue.title.toLowerCase().includes(searchTerm.toLowerCase()));
//   }
//   if (userIds.length > 0) {
//     issues = issues.filter(issue => intersection(issue.userIds, userIds).length > 0);
//   }
//   if (myOnly && currentUserId) {
//     issues = issues.filter(issue => issue.userIds.includes(currentUserId));
//   }
//   if (recent) {
//     issues = issues.filter(issue => moment(issue.updatedAt).isAfter(moment().subtract(3, 'days')));
//   }
//   return issues;
// };

const getSortedListIssues = (issues, status) =>
  issues.filter(issue => issue.status === status).sort((a, b) => a.listPosition - b.listPosition);

const formatIssuesCount = (allListIssues, filteredListIssues) => {
  if (allListIssues.length !== filteredListIssues.length) {
    return `${filteredListIssues.length} of ${allListIssues.length}`;
  }
  return allListIssues.length;
};

export default ProjectBoardList;

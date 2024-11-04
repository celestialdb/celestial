import { createSelector } from '@reduxjs/toolkit';

import { selectUsers } from 'celestial/usersData';
import { intersection } from 'lodash';
import moment from 'moment/moment';
import { selectCurrentUser } from 'celestial/currentUserData';
import { selectProjects } from 'celestial/projectsData';
import { selectIssueAssigneesIds } from 'celestial/issueAssigneesData';
import { selectIssues } from 'celestial/issuesData';
import { selectCache } from 'celestial/cache';

export const selectCurrentProject = createSelector(
  selectCurrentUser,
  selectProjects,
  // And derive data in the output selector
  (user, projects) => {
    if (user.length === 0 || projects.length === 0) return {};
    return projects.filter(project => project.id === user[0].projectId)[0];
  },
);

export const selectIssueAssignees = createSelector(
  selectIssueAssigneesIds,
  selectUsers,
  (issueAssigneeMapping, users) =>
    issueAssigneeMapping.map(assignee => users.find(user => user.id === assignee.id)),
);

export const selectProjectUsers = createSelector(
  selectCurrentProject,
  selectUsers,
  (project, users) => {
    return users.filter(user => user.projectId === project.id);
  },
);

export const selectProjectIssues = createSelector(
  selectCurrentProject,
  selectIssues,
  (project, issues) => {
    return issues.filter(issue => issue.projectId === project.id);
  },
);

export const selectFilteredIssues = createSelector(
  selectProjectIssues,
  selectCache,
  selectCurrentUser,
  (issues, cache, currentUser) => {
    if (cache.filters === undefined) return issues;

    const { searchTerm, userIds, myOnly, recent } = cache.filters;

    let resIssues = issues;
    if (searchTerm) {
      resIssues = resIssues.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (userIds.length > 0) {
      resIssues = resIssues.filter(issue => intersection(issue.userIds, userIds).length > 0);
    }
    if (myOnly && currentUser[0]) {
      resIssues = resIssues.filter(issue => issue.userIds.includes(currentUser[0].id));
    }
    if (recent) {
      resIssues = resIssues.filter(issue =>
        moment(issue.updatedAt).isAfter(moment().subtract(3, 'days')),
      );
    }
    return resIssues;
  },
);

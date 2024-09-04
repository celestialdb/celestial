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

// TODO: right now using all issues, make it project issues
export const selectFilteredIssues = createSelector(
  selectIssues,
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

/* export const selectFilteredTodos = createSelector(
    // First input selector: all todos
    selectTasks,
    // Second input selector: all filter values
    (state) => selectCache(state),
    // Output selector: receives both values
    (todos, filters) => {
        const { status, colors } = filters
        const showAllCompletions = status === StatusFilters.All
        if (showAllCompletions && colors.length === 0) {
            return todos
        }

        // Return either active or completed todos based on filter
        return todos.filter((todo) => {
            const statusMatches =
                showAllCompletions || todo.status === status
            const colorMatches = colors.length === 0 || colors.includes(todo.color)
            return statusMatches && colorMatches
        })
    }
)

export const selectFilteredTodoIds = createSelector(
    // Pass our other memoized selector as an input
    selectFilteredTodos,
    // And derive data in the output selector
    (filteredTodos) => filteredTodos.map((todo) => todo.id)
)

export const selectCompletedTodoIds = createSelector(
    selectTasks,
    // And derive data in the output selector
    (todos) => todos.filter((todo) => todo.status === StatusFilters.Completed).map((todo) => todo.id)
) */

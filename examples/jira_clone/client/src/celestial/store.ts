import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { commentsData } from "./commentsData";
import { issuesData } from "./issuesData";
import { projectsData } from "./projectsData";
import { currentUserData } from "./currentUserData";
import { usersData } from "./usersData";
import { issueAssigneesData } from "./issueAssigneesData";
import cacheReducer from "./cache";
const store = configureStore({
  reducer: {
    comments: commentsData.reducer,
    issues: issuesData.reducer,
    projects: projectsData.reducer,
    currentUser: currentUserData.reducer,
    users: usersData.reducer,
    issueAssignees: issueAssigneesData.reducer,
    cache: cacheReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(issueAssigneesData.middleware)
      .concat(usersData.middleware)
      .concat(currentUserData.middleware)
      .concat(projectsData.middleware)
      .concat(issuesData.middleware)
      .concat(commentsData.middleware),
});
setupListeners(store.dispatch);
export default store;

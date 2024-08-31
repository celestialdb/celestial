import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { issuesData } from "./issuesData";
import { commentsData } from "./commentsData";
import { usersData } from "./usersData";
import { projectsData } from "./projectsData";

import cacheReducer from "./cache";
const store = configureStore({
  reducer: {
    issues: issuesData.reducer,
    comments: commentsData.reducer,
    users: usersData.reducer,
    projects: projectsData.reducer,
    cache: cacheReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(issuesData.middleware)
      .concat(commentsData.middleware)
      .concat(usersData.middleware)
      .concat(projectsData.middleware),
});
setupListeners(store.dispatch);
export default store;

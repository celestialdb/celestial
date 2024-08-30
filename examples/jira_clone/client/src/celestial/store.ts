import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { commentsData } from "./commentsData";
import { issuesData } from "./issuesData";
import { projectsData } from "./projectsData";
import { usersData } from "./usersData";
import cacheReducer from "./cache";
const store = configureStore({
  reducer: {
    comments: commentsData.reducer,
    issues: issuesData.reducer,
    projects: projectsData.reducer,
    users: usersData.reducer,
    cache: cacheReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(commentsData.middleware)
      .concat(issuesData.middleware)
      .concat(projectsData.middleware)
      .concat(usersData.middleware),
});
setupListeners(store.dispatch);
export default store;

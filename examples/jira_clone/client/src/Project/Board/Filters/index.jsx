import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectCache, updateCache } from 'celestial/cache';
import { PageLoader } from 'shared/components';
import { defaultFilters } from 'utils/filters';
import { selectProjectUsers } from 'utils/selectors';
import {
  Filters,
  SearchInput2,
  Avatars,
  AvatarIsActiveBorder,
  StyledAvatar,
  StyledButton,
  ClearAll,
} from './Styles';

const Search = ({ searchTerm, updateSearchTerm }) => {
  return <SearchInput2 icon="search" value={searchTerm} onChange={e => updateSearchTerm(e)} />;
};

const ProjectBoardFilters = () => {
  const dispatch = useDispatch();

  const projectUsers = useSelector(state => selectProjectUsers(state)) || [];

  const filters = useSelector(state => selectCache(state) || {}).filters || {};
  console.log('--- filters: ', filters);

  const { searchTerm, userIds, myOnly, recent } = filters;

  // TODO: handling empty data or esuring render is not problematic if data not ready
  // is partly celestial's responsibility because those issues are not happening with plain react
  if (
    searchTerm === undefined ||
    userIds === undefined ||
    myOnly === undefined ||
    recent === undefined
  )
    return <PageLoader />;

  const areFiltersCleared = !searchTerm && userIds.length === 0 && !myOnly && !recent;

  // TODO: existing filter state is not being carried over.
  // Updating search term clears all other filters
  // Update: this is a problem with InputDebounced implementation
  const updateSearchTerm = e => {
    console.log('--- new search term OG: ', filters, ' input: ', e);
    const tempFilters = { ...filters };
    console.log('--- new search term: ', tempFilters);
    tempFilters.searchTerm = e.target.value;
    console.log('--- new search term2: ', tempFilters);
    dispatch(updateCache('filters', tempFilters));
  };

  function updateUserIds(value) {
    const filterUsers = [...filters.userIds];
    let tempFilterUsers;
    if (filterUsers.includes(value)) {
      // remove user
      tempFilterUsers = filterUsers.filter(user => user !== value);
    } else {
      // add user
      tempFilterUsers = [...filterUsers, value];
    }
    const tempFilters = { ...filters };
    tempFilters.userIds = tempFilterUsers;
    dispatch(updateCache('filters', tempFilters));
  }

  function updateMyOnly(value) {
    const tempFilters = { ...filters };
    tempFilters.myOnly = value;
    dispatch(updateCache('filters', tempFilters));
  }

  function updateRecent(value) {
    const tempFilters = { ...filters };
    tempFilters.recent = value;
    dispatch(updateCache('filters', tempFilters));
  }

  function resetFilters() {
    dispatch(updateCache('filters', defaultFilters));
  }

  return (
    <Filters data-testid="board-filters">
      <Search searchTerm={searchTerm} updateSearchTerm={updateSearchTerm} />
      <Avatars>
        {projectUsers.map(user => (
          <AvatarIsActiveBorder key={user.id} isActive={userIds.includes(user.id)}>
            <StyledAvatar
              avatarUrl={user.avatarUrl}
              name={user.name}
              onClick={() => updateUserIds(user.id)}
            />
          </AvatarIsActiveBorder>
        ))}
      </Avatars>
      <StyledButton variant="empty" isActive={myOnly} onClick={() => updateMyOnly(!myOnly)}>
        Only My Issues
      </StyledButton>
      <StyledButton variant="empty" isActive={recent} onClick={() => updateRecent(!recent)}>
        Recently Updated
      </StyledButton>
      {!areFiltersCleared && <ClearAll onClick={() => resetFilters()}>Clear all</ClearAll>}
    </Filters>
  );
};

export default ProjectBoardFilters;

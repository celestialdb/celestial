import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Avatar, Select, Icon } from 'shared/components';

import { usePutIssuesByIssueIdMutation } from 'celestial/issuesData';
import { useSelector } from 'react-redux';
import { selectProjectUsers } from 'utils/selectors';
import { selectIssueAssigneesById } from 'celestial/issueAssigneesData';
import { User, Username } from './Styles';
import { SectionTitle } from '../Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
};

const ProjectBoardIssueDetailsAssigneesReporter = ({ issue }) => {
  const projectUsers = useSelector(state => selectProjectUsers(state)) || [];
  const issueAssignees =
    useSelector(state => selectIssueAssigneesById(state, issue.id) || {}).userIds || [];

  const [updateIssueCall] = usePutIssuesByIssueIdMutation();

  const updateIssue = async updatedFields => {
    updateIssueCall({ issueId: issue.id, issueInput: updatedFields });
  };

  const getUserById = userId => projectUsers.find(user => user.id === userId);

  const userOptions = projectUsers.map(user => ({ value: user.id, label: user.name }));

  // TODO: updating assignees does not update the UI. You have to refresh the page
  return (
    <Fragment>
      <SectionTitle>Assignees</SectionTitle>
      <Select
        isMulti
        variant="empty"
        dropdownWidth={343}
        placeholder="Unassigned"
        name="assignees"
        value={issueAssignees}
        options={userOptions}
        onChange={userIds => {
          updateIssue({ userIds, users: userIds.map(getUserById) });
        }}
        renderValue={({ value: userId, removeOptionValue }) =>
          renderUser(getUserById(userId), true, removeOptionValue)
        }
        renderOption={({ value: userId }) => renderUser(getUserById(userId), false)}
      />

      <SectionTitle>Reporter</SectionTitle>
      <Select
        variant="empty"
        dropdownWidth={343}
        withClearValue={false}
        name="reporter"
        value={issue.reporterId}
        options={userOptions}
        onChange={userId => updateIssue({ reporterId: userId })}
        renderValue={({ value: userId }) => renderUser(getUserById(userId), true)}
        renderOption={({ value: userId }) => renderUser(getUserById(userId))}
      />
    </Fragment>
  );
};

const renderUser = (user, isSelectValue, removeOptionValue) => (
  <User
    key={user.id}
    isSelectValue={isSelectValue}
    withBottomMargin={!!removeOptionValue}
    onClick={() => removeOptionValue && removeOptionValue()}
  >
    <Avatar avatarUrl={user.avatarUrl} name={user.name} size={24} />
    <Username>{user.name}</Username>
    {removeOptionValue && <Icon type="close" top={1} />}
  </User>
);

ProjectBoardIssueDetailsAssigneesReporter.propTypes = propTypes;

export default ProjectBoardIssueDetailsAssigneesReporter;

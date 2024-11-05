import React from 'react';
import PropTypes from 'prop-types';

import { IssueType, IssueTypeCopy } from 'shared/constants/issues';
import { IssueTypeIcon, Select } from 'shared/components';

import { usePutIssuesByIssueIdMutation } from 'celestial/issuesData';
import { TypeButton, Type, TypeLabel } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
};

const ProjectBoardIssueDetailsType = ({ issue }) => {
  const [updateIssueCall] = usePutIssuesByIssueIdMutation();

  const updateIssue = async updatedFields => {
    updateIssueCall({ issueId: issue.id, issueInput: updatedFields });
  };

  return (
    <Select
      variant="empty"
      dropdownWidth={150}
      withClearValue={false}
      name="type"
      value={issue.type}
      options={Object.values(IssueType).map(type => ({
        value: type,
        label: IssueTypeCopy[type],
      }))}
      onChange={type => updateIssue({ type })}
      renderValue={({ value: type }) => (
        <TypeButton variant="empty" icon={<IssueTypeIcon type={type} />}>
          {`${IssueTypeCopy[type]}-${issue.id}`}
        </TypeButton>
      )}
      renderOption={({ value: type }) => (
        <Type key={type} onClick={() => updateIssue({ type })}>
          <IssueTypeIcon type={type} top={1} />
          <TypeLabel>{IssueTypeCopy[type]}</TypeLabel>
        </Type>
      )}
    />
  );
};

ProjectBoardIssueDetailsType.propTypes = propTypes;

export default ProjectBoardIssueDetailsType;

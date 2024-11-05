import React from 'react';
import PropTypes from 'prop-types';

import toast from 'shared/utils/toast';
import { Button, ConfirmModal } from 'shared/components';
import { useDeleteIssuesByIssueIdMutation } from 'celestial/issuesData';

const propTypes = {
  issue: PropTypes.object.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsDelete = ({ issue, modalClose }) => {
  const [deleteIssue] = useDeleteIssuesByIssueIdMutation();

  const handleIssueDelete = async () => {
    try {
      // await api.delete(`/issues/${issue.id}`);
      // await fetchProject();
      deleteIssue({ issueId: issue.id });
      modalClose();
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <ConfirmModal
      title="Are you sure you want to delete this issue?"
      message="Once you delete, it's gone for good."
      confirmText="Delete issue"
      onConfirm={handleIssueDelete}
      renderLink={modal => (
        <Button icon="trash" iconSize={19} variant="empty" onClick={modal.open} />
      )}
    />
  );
};

ProjectBoardIssueDetailsDelete.propTypes = propTypes;

export default ProjectBoardIssueDetailsDelete;

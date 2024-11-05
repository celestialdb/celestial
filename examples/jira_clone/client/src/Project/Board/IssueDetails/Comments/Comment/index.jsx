import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import toast from 'shared/utils/toast';
import { formatDateTimeConversational } from 'shared/utils/dateTime';
import { ConfirmModal } from 'shared/components';

import { useSelector } from 'react-redux';
import { selectUsersById } from 'celestial/usersData';
import {
  useDeleteCommentsByCommentIdMutation,
  usePutCommentsByCommentIdMutation,
} from 'celestial/commentsData';
import {
  Comment,
  UserAvatar,
  Content,
  Username,
  CreatedAt,
  Body,
  EditLink,
  DeleteLink,
} from './Styles';
import BodyForm from '../BodyForm';

const propTypes = {
  comment: PropTypes.object.isRequired,
};

const ProjectBoardIssueDetailsComment = ({ comment }) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [body, setBody] = useState(comment.body);

  const commentUser = useSelector(state => selectUsersById(state, comment.userId)) || {};
  const [updateComment] = usePutCommentsByCommentIdMutation();
  const [deleteComment] = useDeleteCommentsByCommentIdMutation();

  const handleCommentDelete = async () => {
    try {
      // await api.delete(`/comments/${comment.id}`);
      // await fetchIssue();
      deleteComment({ commentId: comment.id });
    } catch (error) {
      toast.error(error);
    }
  };

  // TODO: on pressing save, a text box showing editted commnet stays
  const handleCommentUpdate = async () => {
    try {
      setUpdating(true);
      // await api.put(`/comments/${comment.id}`, { body });
      // await fetchIssue();
      updateComment({ commentId: comment.id, commentInput: { body } });
      setUpdating(false);
      setFormOpen(false);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Comment data-testid="issue-comment">
      <UserAvatar name={commentUser.name} avatarUrl={commentUser.avatarUrl} />
      <Content>
        <Username>{commentUser.name}</Username>
        <CreatedAt>{formatDateTimeConversational(comment.createdAt)}</CreatedAt>

        {isFormOpen ? (
          <BodyForm
            value={body}
            onChange={setBody}
            isWorking={isUpdating}
            onSubmit={handleCommentUpdate}
            onCancel={() => setFormOpen(false)}
          />
        ) : (
          <Fragment>
            <Body>{comment.body}</Body>
            <EditLink onClick={() => setFormOpen(true)}>Edit</EditLink>
            <ConfirmModal
              title="Are you sure you want to delete this comment?"
              message="Once you delete, it's gone for good."
              confirmText="Delete comment"
              onConfirm={handleCommentDelete}
              renderLink={modal => <DeleteLink onClick={modal.open}>Delete</DeleteLink>}
            />
          </Fragment>
        )}
      </Content>
    </Comment>
  );
};

ProjectBoardIssueDetailsComment.propTypes = propTypes;

export default ProjectBoardIssueDetailsComment;

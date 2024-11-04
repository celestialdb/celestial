import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import toast from 'shared/utils/toast';

import { usePostCommentsMutation } from 'celestial/commentsData';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'celestial/currentUserData';
import BodyForm from '../BodyForm';
import ProTip from './ProTip';
import { Create, UserAvatar, Right, FakeTextarea } from './Styles';

const propTypes = {
  issueId: PropTypes.number.isRequired,
};

const ProjectBoardIssueDetailsCommentsCreate = ({ issueId }) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [body, setBody] = useState('');
  const [postComment] = usePostCommentsMutation();
  const currentUser = useSelector(state => selectCurrentUser(state))[0] || {};

  // TODO: on pressing save, a text box showing new commnet stays
  const handleCommentCreate = async () => {
    try {
      setCreating(true);
      // await api.post(`/comments`, { body, issueId, userId: currentUser.id });
      // await fetchIssue();
      postComment({ commentInput: { body, issueId, userId: currentUser.id } });
      setFormOpen(false);
      setCreating(false);
      setBody('');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Create>
      {currentUser && <UserAvatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} />}
      <Right>
        {isFormOpen ? (
          <BodyForm
            value={body}
            onChange={setBody}
            isWorking={isCreating}
            onSubmit={handleCommentCreate}
            onCancel={() => setFormOpen(false)}
          />
        ) : (
          <Fragment>
            <FakeTextarea onClick={() => setFormOpen(true)}>Add a comment...</FakeTextarea>
            <ProTip setFormOpen={setFormOpen} />
          </Fragment>
        )}
      </Right>
    </Create>
  );
};

ProjectBoardIssueDetailsCommentsCreate.propTypes = propTypes;

export default ProjectBoardIssueDetailsCommentsCreate;

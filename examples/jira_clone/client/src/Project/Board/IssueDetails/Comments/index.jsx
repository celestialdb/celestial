import React from 'react';
import PropTypes from 'prop-types';

import { sortByNewest } from 'shared/utils/javascript';

import { useSelector } from 'react-redux';
import { selectComments } from 'celestial/commentsData';
import Create from './Create';
import Comment from './Comment';
import { Comments, Title } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
};

const ProjectBoardIssueDetailsComments = ({ issue }) => {
  // TODO: problematic to pull ALL comments into local
  const allComments = useSelector(state => selectComments(state)) || [];
  const issueComments = allComments.filter(comment => comment.issueId === issue.id) || [];

  return (
    <Comments>
      <Title>Comments</Title>
      <Create issueId={issue.id} />

      {sortByNewest(issueComments, 'createdAt').map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </Comments>
  );
};

ProjectBoardIssueDetailsComments.propTypes = propTypes;

export default ProjectBoardIssueDetailsComments;

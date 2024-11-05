import React from 'react';

import { Button } from 'shared/components';

import { Header, BoardName } from './Styles';

const ProjectBoardHeader = () => (
  <Header>
    <BoardName>Kanban board</BoardName>
    <a
      href="https://github.com/celestialdb/celestial/tree/main/examples/jira_clone"
      target="_blank"
      rel="noreferrer noopener"
    >
      <Button icon="github">Github Repo</Button>
    </a>
  </Header>
);

export default ProjectBoardHeader;

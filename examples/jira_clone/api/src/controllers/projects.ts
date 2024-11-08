import { Project } from 'entities';
import { catchErrors } from 'errors';
import { findEntityOrThrow, updateEntity } from 'utils/typeorm';
import { issuePartial } from 'serializers/issues';

export const getProjects = catchErrors(async (_req, res) => {
  const projects = await Project.createQueryBuilder('project')
    .select()
    .getMany();

  res.respond({ projects });
});

export const getProjectWithUsersAndIssues = catchErrors(async (req, res) => {
  const project = await findEntityOrThrow(Project, {
    where: {
      id: req.currentUser.projectId,
    },
    relations: ['users', 'issues'],
  });
  res.respond({
    project: {
      ...project,
      issues: project.issues.map(issuePartial),
    },
  });
});

export const update = catchErrors(async (req, res) => {
  const project = await updateEntity(Project, req.body.projectId, req.body);
  res.respond({ project });
});

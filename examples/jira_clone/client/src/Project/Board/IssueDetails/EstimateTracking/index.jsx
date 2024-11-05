import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';

import { InputDebounced, Modal, Button } from 'shared/components';

import { usePutIssuesByIssueIdMutation } from 'celestial/issuesData';
import TrackingWidget from './TrackingWidget';
import { SectionTitle } from '../Styles';
import {
  TrackingLink,
  ModalContents,
  ModalTitle,
  Inputs,
  InputCont,
  InputLabel,
  Actions,
} from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
};

// TODO: original estimate not working because put request failure error code 500
const ProjectBoardIssueDetailsEstimateTracking = ({ issue }) => {
  const [updateIssueCall] = usePutIssuesByIssueIdMutation();

  const updateIssue = async updatedFields => {
    updateIssueCall({ issueId: issue.id, issueInput: updatedFields });
  };
  return (
    <Fragment>
      <SectionTitle>Original Estimate (hours)</SectionTitle>
      {renderHourInput('estimate', issue, updateIssue)}

      <SectionTitle>Time Tracking</SectionTitle>
      <Modal
        testid="modal:tracking"
        width={400}
        renderLink={modal => (
          <TrackingLink onClick={modal.open}>
            <TrackingWidget issue={issue} />
          </TrackingLink>
        )}
        renderContent={modal => (
          <ModalContents>
            <ModalTitle>Time tracking</ModalTitle>
            <TrackingWidget issue={issue} />
            <Inputs>
              <InputCont>
                <InputLabel>Time spent (hours)</InputLabel>
                {renderHourInput('timeSpent', issue, updateIssue)}
              </InputCont>
              <InputCont>
                <InputLabel>Time remaining (hours)</InputLabel>
                {renderHourInput('timeRemaining', issue, updateIssue)}
              </InputCont>
            </Inputs>
            <Actions>
              <Button variant="primary" onClick={modal.close}>
                Done
              </Button>
            </Actions>
          </ModalContents>
        )}
      />
    </Fragment>
  );
};

const renderHourInput = (fieldName, issue, updateIssue) => (
  <InputDebounced
    placeholder="Number"
    filter={/^\d{0,6}$/}
    value={isNil(issue[fieldName]) ? '' : issue[fieldName]}
    onChange={stringValue => {
      const value = stringValue.trim() ? Number(stringValue) : null;
      updateIssue({ [fieldName]: value });
    }}
  />
);

ProjectBoardIssueDetailsEstimateTracking.propTypes = propTypes;

export default ProjectBoardIssueDetailsEstimateTracking;

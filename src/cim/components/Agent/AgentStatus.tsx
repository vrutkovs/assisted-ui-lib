import { Button, Popover, Stack, StackItem } from '@patternfly/react-core';
import * as React from 'react';
import { getHostname, HostStatus } from '../../../common';
import { AgentK8sResource } from '../../types';
import { AgentTableActions, ClusterDeploymentWizardStepsType } from '../ClusterDeployment/types';
import { getAIHosts } from '../helpers/toAssisted';
import { getAgentStatus, getWizardStepAgentStatus } from '../helpers/status';

import '@patternfly/react-styles/css/utilities/Text/text.css';
import { AdditionalNTPSourcesDialogToggle } from '../ClusterDeployment/AdditionalNTPSourcesDialogToggle';
import { useTranslation } from '../../../common/hooks/use-translation-wrapper';

export type AgentStatusProps = {
  agent: AgentK8sResource;
  onApprove?: AgentTableActions['onApprove'];
  onEditHostname?: AgentTableActions['onEditHost'];
  zIndex?: number;
  wizardStepId?: ClusterDeploymentWizardStepsType;
  autoCSR?: boolean;
};

const AgentStatus: React.FC<AgentStatusProps> = ({
  agent,
  onApprove,
  onEditHostname,
  zIndex,
  wizardStepId,
  autoCSR,
}) => {
  const [host] = getAIHosts([agent]);
  const editHostname = onEditHostname ? () => onEditHostname(agent) : undefined;
  const pendingApproval = !agent.spec.approved;

  const hostname = getHostname(host, agent.status?.inventory || {});
  const { t } = useTranslation();
  const status = wizardStepId
    ? getWizardStepAgentStatus(agent, wizardStepId, t)
    : getAgentStatus(agent, false, autoCSR);

  return (
    <HostStatus
      host={host}
      onEditHostname={editHostname}
      zIndex={zIndex}
      AdditionalNTPSourcesDialogToggleComponent={AdditionalNTPSourcesDialogToggle}
      autoCSR={autoCSR}
      {...status}
    >
      {pendingApproval && onApprove && (
        <Popover
          aria-label={t('ai:Approve host popover')}
          minWidth="30rem"
          maxWidth="50rem"
          headerContent={<div>{t('ai:Approve host to join infrastructure environment')}</div>}
          bodyContent={
            <Stack hasGutter>
              <StackItem>
                {t('ai:Make sure that you expect and recognize the host before approving.')}
              </StackItem>
              <StackItem>
                {hostname && <>{t('ai:Hostname: {{hostname}}', { hostname })}</>}
              </StackItem>
            </Stack>
          }
          footerContent={
            <Button variant="link" onClick={() => onApprove(agent)} isInline>
              {t('ai:Approve host')}
            </Button>
          }
        >
          <Button variant="link" isInline className="pf-u-font-size-xs">
            {t('ai:Approve host')}
          </Button>
        </Popover>
      )}
    </HostStatus>
  );
};

export default AgentStatus;

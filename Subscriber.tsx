import React from 'react';
import { useSubscription, SubscriptionHookOptions } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';

interface Props {
  document: DocumentNode;
  options: SubscriptionHookOptions;
}

const Subscriber: React.FC<Props> = ({ document, options }) => {
  useSubscription(document, options);
  return <></>;
};

export default Subscriber;

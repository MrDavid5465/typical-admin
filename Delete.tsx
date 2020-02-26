import React from 'react';
import { useMutation } from './lib';
import { Name, IDispatcher, ITACallBacks } from './';

interface Props {
  dispatcher: IDispatcher;
  match: any;
  history: any;
  id: any;
  name: Name;
  callBacks?: ITACallBacks;
}

const Delete: React.FC<Props> = ({
  dispatcher,
  match,
  history,
  id,
  name,
  callBacks,
}) => {
  const [removeItem] = useMutation(dispatcher.delete, {
    onCompleted: data => {
      history.push(match.url.replace(`/${id}/show`, ''));
      callBacks &&
        callBacks.delete &&
        callBacks.delete(data[`remove${name.singular}`]);
    },
    refetchQueries: [{ query: dispatcher.list }],
  });

  function handleSubmit() {
    const response = window.confirm(
      `Are you sure you'd like to delete this ${name.singular}?`
    );
    response && removeItem({ variables: { id } });
  }

  return (
    <div>
      <button onClick={handleSubmit}>Delete</button>
    </div>
  );
};
export default Delete;

import React from "react";
import { useMutation } from "./lib";
import { Name } from "./";

interface Props {
  dispatcher: any;
  match: any;
  history: any;
  id: any;
  name: Name;
}

const Delete: React.FC<Props> = ({ dispatcher, match, history, id, name }) => {
  const [removeItem] = useMutation(dispatcher.remove, {
    onCompleted: () => history.push(match.url.replace(`/${id}/show`, "")),
    refetchQueries: [{ query: dispatcher.list }]
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

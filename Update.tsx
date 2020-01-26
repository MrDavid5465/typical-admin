import React, { createRef, useState } from "react";
import { useMutation, useQuery, Form } from "./lib";
import { Name } from "./";
import Links from "./Links";

interface Props {
  dispatcher: any;
  history: any;
  match: any;
  name: Name;
  schemaDefinition: any;
}

const Update: React.FC<Props> = ({
  dispatcher,
  history,
  match,
  name,
  schemaDefinition
}) => {
  const id = match.params.id;
  const queryName = `get${name.singular}`;
  const [isValid, setIsValid] = useState(false);
  const { data, error, loading } = useQuery(dispatcher.get, {
    variables: { id }
  });
  const initialValues = !loading && !error && data[queryName];

  const [updateItem] = useMutation(dispatcher.edit, {
    onCompleted: data => history.push(match.url.replace("edit", "show")),
    refetchQueries: [
      { query: dispatcher.show, variables: { id } },
      { query: dispatcher.list }
    ]
  });
  const editRef: React.RefObject<any> = createRef();
  function handleReset() {
    editRef.current.reset();
  }

  if (error) {
    return <span>{`error: ${error}`}</span>;
  }

  if (loading) {
    return <span>{`loading...`}</span>;
  }

  function handleSubmit() {
    editRef.current.isValid &&
      updateItem({ variables: { id, update: editRef.current.submit() } });
  }
  function handleChange() {
    setIsValid(editRef.current.isValid);
  }

  return (
    <div>
      <h4>Edit {name.singular}</h4>
      <Form
        ref={editRef}
        name={"update"}
        form={schemaDefinition}
        initialValues={initialValues}
        onChange={handleChange}
      />
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleSubmit} disabled={!isValid}>
        Submit
      </button>
      <hr />
      <Links match={match} name={name} dispatcher={dispatcher} />
    </div>
  );
};
export default Update;

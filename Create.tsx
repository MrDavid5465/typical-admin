import React, { createRef, useState } from "react";
import { useMutation } from "./lib";
import { Name, IDispatcher, ITACallBacks } from "./";

import Links from "./Links";
import { SchemaDefinition } from "./lib";
import Form from "./lib/templates/Form";

interface Props {
  dispatcher: IDispatcher;
  match: any;
  history: any;
  name: Name;
  schemaDefinition?: SchemaDefinition<any>;
  callBacks?: ITACallBacks;
}

const New: React.FC<Props> = ({
  dispatcher,
  match,
  history,
  name,
  schemaDefinition,
  callBacks
}) => {
  const newRef: React.RefObject<any> = createRef();
  const [isValid, setIsValid] = useState(false);
  const [createItem] = useMutation(dispatcher.new, {
    onCompleted: data => {
      history.push(
        match.url.replace("new", `${data[`add${name.singular}`].id}/show`)
      );
      callBacks && callBacks.new && callBacks.new([`add${name.singular}`]);
    },
    refetchQueries: [{ query: dispatcher.list }]
  });

  function handleCreate() {
    console.log(newRef.current.isValid);
    newRef.current.isValid &&
      createItem({ variables: { values: newRef.current.submit() } });
  }
  function handleReset() {
    newRef.current && newRef.current.reset();
  }
  function handleChange() {
    setIsValid(newRef.current.isValid);
  }

  return (
    <div>
      <h5>New {name.singular}</h5>
      <Form
        ref={newRef}
        name={"create"}
        form={schemaDefinition || {}}
        onChange={handleChange}
      />
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleCreate} disabled={!isValid}>
        Submit
      </button>
      <hr />
      <Links match={match} name={name} dispatcher={dispatcher} />
    </div>
  );
};
export default New;

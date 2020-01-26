import React, { createRef, useState } from "react";
import { Name, DefaultButton, PrimaryButton, Form } from "./lib";
import { useMutation, Stack, Separator } from "./lib";

import Links from "./Links";
import { SchemaDefinition } from "../../lib/interfaces";

interface Props {
  dispatcher: any;
  match: any;
  history: any;
  name: Name;
  schemaDefinition: SchemaDefinition<any>;
  app?: string;
}

const New: React.FC<Props> = ({
  dispatcher,
  match,
  history,
  name,
  schemaDefinition,
  app
}) => {
  const newRef: React.RefObject<any> = createRef();
  const [isValid, setIsValid] = useState(false);
  const [createItem] = useMutation(dispatcher.create, {
    onCompleted: data =>
      history.push(
        match.url.replace("new", `${data[`add${name.singular}`].id}/show`)
      ),
    refetchQueries: [{ query: dispatcher.list }]
  });

  function handleCreate() {
    console.log(newRef.current.isValid);
    newRef.current.isValid &&
      createItem({
        variables: {
          values: app
            ? { ...newRef.current.submit(), app }
            : newRef.current.submit()
        }
      });
  }
  function handleReset() {
    newRef.current && newRef.current.reset();
  }
  function handleChange() {
    setIsValid(newRef.current.isValid);
  }

  return (
    <Stack>
      <h5>New {name.singular}</h5>
      <Form
        ref={newRef}
        name={"create"}
        form={schemaDefinition}
        onChange={handleChange}
      />
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <DefaultButton onClick={handleReset}>Reset</DefaultButton>
        <PrimaryButton onClick={handleCreate} disabled={!isValid}>
          Submit
        </PrimaryButton>
      </Stack>
      <Separator />
      <Links match={match} name={name} />
    </Stack>
  );
};

export default New;

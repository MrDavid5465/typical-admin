import React from "react";
import { useMutation, Name, PrimaryButton, Stack } from "./lib";

import Prompt from "./Prompt";

interface Props {
  dispatcher: any;
  history: any;
  match: any;
  id: any;
  name: Name;
}

const Delete: React.FC<Props> = ({ dispatcher, history, match, id, name }) => {
  const [open, setOpen] = React.useState(false);

  const [removeItem] = useMutation(dispatcher.remove, {
    onCompleted: () => history.push(match.url.replace(`/${id}/show`, "")),
    refetchQueries: [{ query: dispatcher.list }]
  });

  function handleSubmit(response = false) {
    setOpen(!open);
    response && removeItem({ variables: { id } });
  }

  return (
    <Stack>
      <PrimaryButton text="Delete" onClick={() => setOpen(true)} />
      <Prompt
        message={`Are you sure you'd like to delete this ${name.singular}?`}
        isOpen={open}
        toggle={handleSubmit}
      />
    </Stack>
  );
};
export default Delete;

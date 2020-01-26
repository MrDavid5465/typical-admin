import React, { createRef, useState } from "react";
import {
  Name,
  Stack,
  Separator,
  DefaultButton,
  PrimaryButton,
  Form
} from "./lib";
import { useMutation, useQuery } from "./lib";

import Links from "./Links";
import { getCurrentApp } from "../";

interface Props {
  dispatcher: any;
  history: any;
  match: any;
  name: Name;
  schemaDefinition: any;
  app: string;
}

const Update: React.FC<Props> = ({
  dispatcher,
  history,
  match,
  name,
  schemaDefinition,
  app
}) => {
  const id = match.params.id;
  const [isValid, setIsValid] = useState(false);
  const queryName = `get${name.singular}`;

  const { data, error, loading } = useQuery(dispatcher.get, {
    variables: { id }
  });
  const initialValues = !loading && !error && data[queryName];

  const [updateItem] = useMutation(dispatcher.update, {
    onCompleted: data => history.push(match.url.replace("edit", "show")),
    refetchQueries: [
      { query: dispatcher.get, variables: { id } },
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
      updateItem({
        variables: {
          id,
          update: app
            ? { ...editRef.current.submit(), app }
            : editRef.current.submit()
        }
      });
  }
  function handleChange() {
    setIsValid(editRef.current.isValid);
  }

  return (
    <Stack>
      <h4>Edit {name.singular}</h4>
      <Form
        ref={editRef}
        name={"update"}
        form={schemaDefinition}
        initialValues={initialValues}
        onChange={handleChange}
      />
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <DefaultButton onClick={handleReset}>Reset</DefaultButton>
        <PrimaryButton onClick={handleSubmit} disabled={!isValid}>
          Submit
        </PrimaryButton>
      </Stack>
      <Separator />
      <Links match={match} name={name} />
    </Stack>
  );
};
// const Form: React.FC<{
//   schemaDefinition: SchemaDefinition<any>;
//   initialValues: any;
//   onSubmit: (values: any) => void;
// }> = ({ schemaDefinition, initialValues, onSubmit }) => {
//   const {
//     schema,
//     values,
//     change,
//     dirty,
//     errors,
//     focus,
//     isValid,
//     reset,
//     submit,
//     touched
//   } = useForm({ schema: schemaDefinition, passedValues: initialValues });
//   function handleSubmit() {
//     isValid && onSubmit(submit());
//   }
//   return (
//     <Stack>
//       <FormWrapper
//         schema={schema}
//         Template={Field}
//         values={values}
//         errors={errors}
//         onChange={change}
//         dirty={dirty}
//         onFocus={focus}
//         touched={touched}
//       />
//       <Stack horizontal tokens={{ childrenGap: 10 }}>
//         <DefaultButton onClick={reset}>Reset</DefaultButton>
//         <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
//       </Stack>
//     </Stack>
//   );
// };
export default Update;

import React from "react";
import Links from "./Links";
import Delete from "./Delete";
import { useQuery, Stack, Separator, Name } from "./lib";

interface Props {
  dispatcher: any;
  history: any;
  match: any;
  name: Name;
  schemaDefinition: any;
}

const Show: React.FC<Props> = ({
  dispatcher,
  history,
  match,
  name,
  schemaDefinition
}) => {
  const id = match.params.id;
  const queryName = `get${name.singular}`;
  const { data, error, loading } = useQuery(dispatcher.get, {
    variables: { id }
  });

  if (error) {
    return <span>{`error: ${error}`}</span>;
  }

  if (loading) {
    return <span>{`loading...`}</span>;
  }

  return (
    <Stack>
      <h4>Showing {name.singular}</h4>
      {Object.entries(schemaDefinition).map(([k, v]: any) => {
        console.log(schemaDefinition[k].label);
        return (
          <p key={k}>
            <strong>{v.label}</strong>:{" "}
            {v.onRender
              ? v.onRender({
                  value: data[queryName][k],
                  values: data[queryName]
                })
              : data[queryName][k]}
          </p>
        );
      })}
      <Delete
        history={history}
        id={id}
        name={name}
        match={match}
        dispatcher={dispatcher}
      />
      <Separator />
      <Links match={match} name={name} />
    </Stack>
  );
};
export default Show;

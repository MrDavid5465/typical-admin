import React from "react";
import Links from "./Links";
import Delete from "./Delete";
import { useQuery } from "./lib";
import { Name, IDispatcher, ITACallBacks, DisplaySchema } from "./";

interface Props {
  dispatcher: IDispatcher;
  history: any;
  match: any;
  name: Name;
  schemaDefinition: DisplaySchema<any>;
  callBacks?: ITACallBacks;
}

const Show: React.FC<Props> = ({
  dispatcher,
  history,
  match,
  name,
  schemaDefinition,
  callBacks
}) => {
  const id = match.params.id;
  const queryName = `get${name.singular}`;
  const { data, error, loading } = useQuery(dispatcher.show, {
    variables: { id }
  });

  if (error) {
    return <span>{`error: ${error}`}</span>;
  }

  if (loading) {
    return <span>{`loading...`}</span>;
  }

  return (
    <div>
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
      {dispatcher.delete && (
        <Delete
          history={history}
          id={id}
          name={name}
          match={match}
          dispatcher={dispatcher}
          callBacks={callBacks}
        />
      )}
      <hr />
      <Links match={match} name={name} dispatcher={dispatcher} />
    </div>
  );
};
export default Show;

import React from "react";
import { Link } from "./lib";
import Links from "./Links";
import { useQuery } from "./lib";
import { Name } from "./";
interface Props {
  dispatcher: any;
  match: any;
  history: any;
  name: Name;
  schemaDefinition: any;
}

const List: React.FC<Props> = ({
  dispatcher,
  match,
  history,
  name,
  schemaDefinition
}) => {
  const queryName = `get${name.plural}`;
  const { data: items, error, loading } = useQuery(dispatcher.list);
  if (error) {
    return <span>{`error: ${error}`}</span>;
  }

  if (loading) {
    return <span>{`loading...`}</span>;
  }

  return (
    <div>
      <h4>Listing </h4>
      <table>
        <thead>
          <tr>
            {Object.entries(schemaDefinition).map(([k, v]: any) => (
              <th key={k}>{v.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items[queryName].map((item: any, i: number) => {
            return (
              <tr key={item.id || i}>
                {Object.entries(schemaDefinition).map(([k, v]: any) => (
                  <td key={k}>
                    {item[k].onRender
                      ? item[k].onRender({ value: item[k], values: item })
                      : item[k]}
                  </td>
                ))}
                <td>
                  <Link
                    to={{
                      pathname: `${match.url}/${item.id}/show`,
                      state: item
                    }}
                  >
                    {" "}
                    Show
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <hr />
      <Links match={match} name={name} />
    </div>
  );
};
export default List;

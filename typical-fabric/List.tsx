import React from "react";
import { Stack, Name, useQuery } from "./lib";
import Links from "./Links";
import { List as DetailsList } from "../../lib";

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
  console.log(items[queryName]);
  return (
    <Stack>
      <h4>Listing {name.plural}</h4>
      <DetailsList
        name={name.plural}
        schema={schemaDefinition}
        onSelect={item => history.push(`${match.url}/${item.id}/show`, item)}
        items={
          items[queryName] || []
          //   .map((item: any, i: number) => {
          //   return {
          //     Program: (
          //       <Link
          //         className={style.link}
          //         to={{ pathname: `${match.url}/${item.id}/show`, state: item }}
          //       >
          //         {item["name"]}
          //       </Link>
          //     )
          //   };
          // })
        }
      />
      <br />
      <Links match={match} name={name} />
    </Stack>
  );
};
export default List;

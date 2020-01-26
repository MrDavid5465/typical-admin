import React from "react";
import ReactiveAdmin, { DisplaySchema } from "./lib";

import Update from "./Update";
import List from "./List";
import Create from "./Create";
import Show from "./Show";
import { SchemaDefinition } from "@octant/per-form";

interface Props {
  dispatcher: { list: any; create: any; get: any; update: any; remove: any };
  match: any;
  name: any;
  components?: any;
  schemaDefinition: {
    list: DisplaySchema<any>;
    create: SchemaDefinition<any>;
    review: DisplaySchema<any>;
    update: SchemaDefinition<any>;
  };
  app?: string;
}

const Index: React.FC<Props> = ({
  dispatcher,
  match,
  name,
  schemaDefinition,
  components,
  app
}) => {
  return (
    <ReactiveAdmin
      dispatcher={dispatcher}
      match={match}
      name={name}
      components={{
        list: List,
        create: (props: any) => <Create {...props} app={app} />,
        review: Show,
        update: (props: any) => <Update {...props} app={app} />,
        ...components
      }}
      schemaDefinition={schemaDefinition}
    />
  );
};
export default Index;

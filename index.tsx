import React from "react";
import { Route } from "./lib";

import Update from "./Update";
import List from "./List";
import Create from "./Create";
import Show from "./Show";
import { SchemaDefinition } from "@octant/per-form";

export interface Name {
  singular: string;
  plural: string;
}
export interface Row {
  value: any;
  values: any;
}
export interface DisplayField {
  label: string;
  onRender?: (row: Row) => any;
  options: any;
}
export type DisplaySchema<T> = {
  [key in keyof T]: DisplayField;
};

interface Props {
  dispatcher: { list: any; create: any; get: any; update: any; remove: any };
  match: any;
  name: any;
  components?: { list: any; create: any; review: any; update: any };
  schemaDefinition: {
    list: DisplaySchema<any>;
    create: SchemaDefinition<any>;
    review: DisplaySchema<any>;
    update: SchemaDefinition<any>;
  };
}

const Index: React.FC<Props> = ({
  dispatcher,
  match,
  name,
  components = {},
  schemaDefinition
}) => {
  return (
    <div>
      <Route
        path={match.url}
        exact
        render={props => {
          return components.list ? (
            React.createElement(components.list, {
              dispatcher,
              name,
              schemaDefinition: schemaDefinition.list,
              ...props
            })
          ) : (
            <List
              dispatcher={dispatcher}
              name={name}
              schemaDefinition={schemaDefinition.list}
              {...props}
            />
          );
        }}
      />

      <Route
        path={`${match.url}/new`}
        render={props => {
          return components.create ? (
            React.createElement(components.create, {
              dispatcher,
              name,
              schemaDefinition: schemaDefinition.create,
              ...props
            })
          ) : (
            <Create
              dispatcher={dispatcher}
              name={name}
              schemaDefinition={schemaDefinition.create}
              {...props}
            />
          );
        }}
      />

      <Route
        path={`${match.url}/:id/show`}
        render={props => {
          return components.review ? (
            React.createElement(components.review, {
              dispatcher,
              name,
              schemaDefinition: schemaDefinition.review,
              ...props
            })
          ) : (
            <Show
              dispatcher={dispatcher}
              name={name}
              schemaDefinition={schemaDefinition.review}
              {...props}
            />
          );
        }}
      />

      <Route
        path={`${match.url}/:id/edit`}
        render={props => {
          return components.update ? (
            React.createElement(components.update, {
              dispatcher,
              name,
              schemaDefinition: schemaDefinition.update,
              ...props
            })
          ) : (
            <Update
              dispatcher={dispatcher}
              name={name}
              schemaDefinition={schemaDefinition.update}
              {...props}
            />
          );
        }}
      />
    </div>
  );
};
export default Index;

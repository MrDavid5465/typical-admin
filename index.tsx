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
  dispatcher: { list: any; new?: any; show: any; edit?: any; delete?: any };
  match: any;
  name: any;
  components?: { list?: any; new?: any; show?: any; edit?: any };
  schemaDefinition: {
    list: DisplaySchema<any>;
    new?: SchemaDefinition<any>;
    show: DisplaySchema<any>;
    edit?: SchemaDefinition<any>;
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

      {dispatcher.new && schemaDefinition.new && (
        <Route
          path={`${match.url}/new`}
          render={props => {
            return components.new ? (
              React.createElement(components.new, {
                dispatcher,
                name,
                schemaDefinition: schemaDefinition.new,
                ...props
              })
            ) : (
              <Create
                dispatcher={dispatcher}
                name={name}
                schemaDefinition={schemaDefinition.new}
                {...props}
              />
            );
          }}
        />
      )}

      <Route
        path={`${match.url}/:id/show`}
        render={props => {
          return components.show ? (
            React.createElement(components.show, {
              dispatcher,
              name,
              schemaDefinition: schemaDefinition.show,
              ...props
            })
          ) : (
            <Show
              dispatcher={dispatcher}
              name={name}
              schemaDefinition={schemaDefinition.show}
              {...props}
            />
          );
        }}
      />

      {dispatcher.edit && schemaDefinition.edit && (
        <Route
          path={`${match.url}/:id/edit`}
          render={props => {
            return components.edit ? (
              React.createElement(components.edit, {
                dispatcher,
                name,
                schemaDefinition: schemaDefinition.edit,
                ...props
              })
            ) : (
              <Update
                dispatcher={dispatcher}
                name={name}
                schemaDefinition={schemaDefinition.edit}
                {...props}
              />
            );
          }}
        />
      )}
    </div>
  );
};
export default Index;

# Building your own typical-admin

typical-admin is a pattern first and a library second. The code in this repo
(React, react-router, Apollo, a typiql GraphQL backend) is one way to build
that pattern. It isn't the definition of it. If your app runs on a different
platform, UI kit or backend, you build your own variant. It should look and
work the way your app needs.

There are two ways to build your own:

| You want | Do this | Example |
|---|---|---|
| A different look, on the same React + GraphQL stack | Write a **skin** over this repo's `ReactiveAdmin`: your own `List`, `Show`, `Create`, `Update` and form template, with the same props. See the README, [Building your own styled variant](README.md#building-your-own-styled-variant). | [typical-admin-fabric](https://github.com/MrDavid5465/typical-admin-fabric) (Fluent UI) |
| A different platform, data layer, backend or schema format | Write a **variant**: your own implementation of the pattern, from the data layer up. This guide. | [typical-admin-wc](https://github.com/MrDavid5465/typical-admin-wc) (Lit + Web Awesome) |

A variant doesn't have to be compatible with this repo or with any other
variant. Its schema format, its names and its API are its own. What carries
over between variants is the pattern below. The point isn't that schemas
port between variants. The point is that every app built on a variant stays
consistent with every other app built on it.

## What makes it a typical-admin

Keep these. Without them you have a component library, not this pattern.

1. **Generated CRUD from one description per record type.** A new record
   type costs a config object: its operations, display names and a schema
   for list, show, new and edit. It doesn't cost hand-written pages. From
   that one object the variant renders a list, a detail view, create and
   edit forms and delete, each on its own nested route under one mount
   path:

   | Route below the mount path | Slot | When |
   |---|---|---|
   | (the list, and anything unmatched) | `list` | always |
   | `new` | `new` | the record type can be created |
   | `:id/show` | `show` | always |
   | `:id/edit` | `edit` | the record type can be edited |

   Read-only types simply have no `new` or `edit`. Deep links to any of these
   routes must work.

2. **Slots you can override, with one prop contract.** Every slot gets the
   same props whether it's a default or a custom one. Overriding one slot
   leaves the rest generated. Build a custom slot by copying the default it
   replaces, so the data flow stays identical.

3. **The schema grows before the component count does.** When a need comes
   up more than once (a money field, a searchable picker, a date format), it
   becomes part of the schema: a field type, a format option, an options
   source. It doesn't become a one-off component in an app. A fully custom
   slot is a deliberate choice, not the first resort.

4. **Display text is separate from backend names.** Headings, buttons and
   field labels come from labels you can override, not from type or
   operation names. The React stack learned this one the hard way, with
   headings like "Showing Device".

5. **One shared live-update service**, if your backend has live updates.
   Screens register what they want to hear about; the variant decides how
   that travels (one socket, a merged operation, polling, local change
   events). No screen opens its own connection.

6. **Skills ship with the variant.** An agent can't use your variant well
   from its source alone. It'll write properties your form engine silently
   ignores, and hand-roll what your schema already offers. At minimum, ship
   these:
   - **the admin pattern**: the record-type config, routes, slots and the
     override contract;
   - **form schema**: every field type and property your form engine
     actually implements, ideally with a check script that rejects unknown
     properties;
   - **list schema**: columns, formats, filters and paging;
   - **hand-rolled components**: how to build a one-off component from your
     UI kit's primitives and theme tokens, and where reusable pieces go;
   - **verify**: how to run the app and drive it in a real browser or device
     so the agent can check its own work.

   In one-shot tests of this stack, an agent with the skills wrote the same
   app's core logic in 238 lines instead of 618, because it used the
   generated screens instead of writing its own.

7. **Generic code flows back into the variant.** If an app built on your
   variant contains code that isn't about that app's domain (a validator, a
   picker, a date or money formatter, a layout fix), the variant is missing
   it. Move it upstream so the next app gets it for free. Form validation is
   the clearest case. It belongs in the form schema; validation hand-written
   outside it is a bug in the app, not a style choice.

## What's yours to decide

Everything else. Decide these up front, and write your answers into your
README and skills. They're what an agent most needs to know.

- **Platform and rendering:** React DOM, React Native, web components, a
  native toolkit; and which UI kit draws it.
- **Data layer and backend:** a GraphQL server with generated operations,
  REST, a local database, an encrypted on-device store that syncs, or several
  of these. Where list, filter and sort logic runs (server or client) follows
  from this.
- **How operations are described:** typical-admin calls this the
  `dispatcher`, one entry per operation. Yours might be endpoints, repository
  methods or store calls. Decide how results are found (by a naming
  convention, by the first field of a response, by a return value) and what
  variables each operation takes.
- **Schema format:** field types, properties, validation, conversion between
  form values and stored values, and how an app adds a field type of its own.
- **Routing:** your platform's router, adapted to the route table above.
- **Live updates:** whether there are any, and over what transport.
- **Distribution:** source you clone in, a package or a template.

## How the two existing variants answered

| Question | typical-admin + typical-admin-fabric + per-form | typical-admin-wc |
|---|---|---|
| Platform, UI kit | React DOM, Fluent UI | Web components (Lit 3), Web Awesome 3; works with or without a bundler |
| Backend | typiql GraphQL | typiql GraphQL |
| Data client | Apollo Client 4 (React) | Apollo Client 4 core, no React |
| Operations | `dispatcher`: one GraphQL document per operation, written by hand | `dispatcher`, written for you by `typiqlDispatcher({ type, fields, filters })` |
| Finding results | by name: `get${plural}`, `add${singular}`, ..., so `name` must be typiql's stem | from each document's first root field; `name` is display text only |
| Display text | `labels`, opt-in (pass `labels` to switch from the old headings) | `labels`, always on, with defaults built from `name` |
| Forms | per-form `SchemaDefinition`; the field types are a fixed switch in the template `Fabric.tsx`; validation via `validations: [{ test, message }]` | its own schema in `<ta-form>`; new field types via `registerFieldType`; money/number limits, searchable select, combobox with create |
| Lists | `DisplaySchema` columns rendered by Fluent lists | its own columns with `format`, filters, server or client paging |
| Routing | react-router v7 nested `<Routes>` | the browser's Navigation API + URLPattern |
| Slot overrides | `components={{ list, new, show, edit, delete, links }}`, React components | same keys; a tag name, an element class or a render function |
| Live updates | merged-subscription service: every subscription merged into one multipart HTTP operation | one WebSocket (`graphql-ws`) shared by every subscription; merging optional, for multipart |
| Data entry | full-page create form | also quick entry: a dialog or inline panel that stays open between saves |
| Delete | button on show, native or shared confirm | button on show and per row; confirm or undo |
| Skills | reactive-admin, form-schema, list-schema, hand-rolled-components, playwright-verify | admin-pattern, form-schema, list-schema, hand-rolled-components, playwright-verify |

Same pattern, and very different answers almost everywhere else. Neither
variant's schema works in the other, and that's fine.

## Building one

1. **Write down your answers** to the questions above, in your README.
2. **Start with the data layer.** Define the per-record-type description
   (your `dispatcher`): list, get one, create, update, delete, and optionally
   subscribe. Prove it against your real backend before drawing anything.
3. **Add the router and the route table**, with deep links.
4. **Write the default slots** (`list`, `show`, `new`, `edit`, `delete`, and
   a navigation row like `links`), all taking the same props. Copying this
   repo's or typical-admin-wc's defaults is a fine starting point: they show
   which props each slot needs.
5. **Write the form engine**: your field-type catalog, validation and
   value conversion, plus a way for apps to register a field type of their
   own. Then the list's column formats.
6. **Add labels**, with sensible defaults built from the display names.
7. **Add live updates** through one shared service, if your backend has them.
8. **Write the skills**, and a check script for your form schema.
9. **Build a real app on it.** List everything in the app that isn't about
   the app's domain, and move it into the variant. Repeat for each new app.

## The shell: denim

typical-admin draws the screens; [denim](https://github.com/MrDavid5465/denim)
draws the frame around them (applications, navigation, settings, themes,
health). denim follows the same split: a headless core plus skins
(denim-fabric-topbar, denim-fabric-sidebar), which export the same members so
an app switches skins by changing an import path. If your variant is on a
different platform, you'll usually need a denim for it as well, the way
typical-admin-wc pairs with [denim-wc](https://github.com/MrDavid5465/denim-wc).
See denim's README, *Writing a skin*.

## Checklist

- [ ] One description per record type gives list, show, new, edit and delete
- [ ] The route table works, including deep links
- [ ] Every slot can be overridden and gets the same props as the default
- [ ] Display text comes from labels, not backend names
- [ ] Repeatable needs are schema vocabulary (field types, formats), with an
      extension point for apps
- [ ] Validation lives in the form schema
- [ ] Live updates go through one shared service (if any)
- [ ] The skills ship in the repo: admin pattern, form schema (with a check
      script), list schema, hand-rolled components, verify
- [ ] The README answers "what's yours to decide" for this variant

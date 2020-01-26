import React from "react";
import { Link } from "./lib";
import { Name } from "./";
interface Props {
  match: any;
  name: Name;
  dispatcher: any;
}
const Links: React.FC<Props> = ({ match, name, dispatcher }) => {
  const urls = {
    edit: new RegExp(`/edit$`),
    new: new RegExp(`/new$`),
    root: new RegExp(`/${name.plural.toLowerCase()}$`),
    show: new RegExp(`/show$`)
  };

  if (urls.show.test(match.url)) {
    return (
      <>
        {dispatcher.edit && (
          <>
            <Link to={`${match.url.replace("show", "edit")}`}>Edit</Link> |{" "}
          </>
        )}
        <Link to={`${match.url.replace(`/${match.params.id}/show`, "")}`}>
          Back
        </Link>
      </>
    );
  } else if (urls.edit.test(match.url)) {
    return <Link to={`${match.url.replace("edit", "show")}`}>Back</Link>;
  } else if (urls.new.test(match.url)) {
    return <Link to={`${match.url.replace(`/new`, "")}`}>Back</Link>;
  } else if (urls.root.test(match.url)) {
    return (
      <>
        {dispatcher.new && (
          <>
            <Link to={`${match.url}/new`}>New</Link> |{" "}
          </>
        )}
        <Link to={`${match.url.replace(match.url, "")}`}>Back</Link>
      </>
    );
  } else {
    return null;
  }
};
export default Links;

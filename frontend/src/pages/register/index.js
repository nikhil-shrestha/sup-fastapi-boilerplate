import React from "react";
import loadable from "@loadable/component";
import DefaultLoading from "../../components/defaultLoading/defaultLoading";

export default loadable((props) => import("./register"), {
  fallback: <DefaultLoading />,
});

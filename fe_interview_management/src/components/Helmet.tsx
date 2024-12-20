import { Helmet as HelmetWrapper } from "react-helmet";
import {HelmetProps} from "@/vite-env";

function Helmet(props: HelmetProps) {
  return (
    <HelmetWrapper>
      <title>IMS | {props.title}</title>
      <meta name="description" content={props.description} />
    </HelmetWrapper>
  );
}

Helmet.defaultProps = {
  title: "IMS",
  description: "",
};

export default Helmet;

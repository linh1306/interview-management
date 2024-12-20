import Spinner from "@/components/Spinner";
import {Alert} from "antd";
import {AsyncWrapperProps} from "@/vite-env";

function AsyncWrapper(props: AsyncWrapperProps) {
  if (props.loading) {
    return <Spinner />;
  } else if (props.error) {
    return (
      <Alert
          type="error"
          message="Error"
          description={JSON.stringify(props.error)}
      />
    );
  } else if (props.fulfilled) {
    return props.children;
  } else {
    return <>Something has happen</>;
  }
}

AsyncWrapper.defaultValue = {
  loading: true,
  fulfilled: false,
  error: null,
  children: <></>,
};

export default AsyncWrapper;

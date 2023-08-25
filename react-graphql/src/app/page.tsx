import AuthenticationGuard from "@/components/authentication/AuthenticationGuard";
import HomePage from "./HomePage";

const Page = () => {
  return (
    <AuthenticationGuard>
      <HomePage></HomePage>
    </AuthenticationGuard>
  );
};

export default Page;
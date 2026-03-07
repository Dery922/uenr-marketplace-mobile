import { Redirect } from "expo-router";

export default function Index() {
  const href: any = "/(auth)/LandingScreen";
  return <Redirect href={href} />;
}

import Head from "next/head";
import { api } from "~/utils/api";

export default function Home() {
  const common = api.common.hello.useQuery();

  return (
    <>
      <Head>
        <title>Live at Heart 2024</title>
        <meta name="description" content="Live at Heart" />
      </Head>

      <div>
        <h1>Hello {common.data?.greeting}</h1>
      </div>
    </>
  );
}

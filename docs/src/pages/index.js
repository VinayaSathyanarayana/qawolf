import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import React from "react";
import Banner from "../components/Banner";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Subscribe from "../components/Subscribe";

const headStyles = `
.react-toggle {
  display: none;
}

#mc_embed_signup input.button {
  background-color: var(--ifm-color-primary);
}

#mc_embed_signup input.button:hover {
  background-color: var(--ifm-color-primary-darker);
}

#mc_embed_signup { 
  background: #fff; 
  clear: left; 
  font-family: var(--ifm-font-family-base);
  width: 100%;
}
`;

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Head>
        <style>{headStyles}</style>
      </Head>
      <header>
        <Banner />
      </header>
      <main>
        <Features />
        <HowItWorks />
        <Subscribe />
      </main>
    </Layout>
  );
}

export default Home;

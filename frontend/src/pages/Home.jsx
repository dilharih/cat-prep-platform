import Hero from "../components/common/Hero";
import Features from "../components/common/Features";
import MainLayout from "../layouts/MainLayout";

function Home() {
  return (
    <MainLayout>
      <Hero />
      <Features />
    </MainLayout>
  );
}

export default Home;

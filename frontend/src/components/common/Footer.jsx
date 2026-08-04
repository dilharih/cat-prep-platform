import Container from "../ui/Container";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-xl font-bold text-blue-600">
              CAT Prep
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Practice smarter. Perform better.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            © {year} CAT Prep. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
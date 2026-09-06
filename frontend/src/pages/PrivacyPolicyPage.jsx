import { Link } from "react-router-dom";
import ThemeToggle from "../components/common/ThemeToggle";
import "../styles/privacy-policy.css";

function PrivacyPolicyPage() {
  return (
    <main className="privacy-policy-page min-h-screen bg-[#f6f5f5] text-[#276678] dark:bg-[#091a21] dark:text-[#d3e0ea]">
      <header className="border-b border-[#d3e0ea] bg-white/90 backdrop-blur-md dark:border-[#285363] dark:bg-[#102a33]/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-10">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#276678] text-sm font-black text-white">
              C
            </span>
            CAT <span className="text-[#1687a7]">Prep</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className="rounded-xl border border-[#276678] bg-white px-4 py-2 text-sm font-bold text-[#276678] transition hover:bg-[#276678] hover:text-white dark:border-[#d3e0ea] dark:bg-transparent dark:text-[#d3e0ea] dark:hover:bg-[#d3e0ea] dark:hover:text-[#102a33]"
            >
              Back home
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-12 sm:px-10 sm:py-16">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#1687a7]">Legal</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm leading-6 text-[#5f7f8d] dark:text-[#9bb5bf]">
            Last updated: September 6, 2026
          </p>
        </div>

        <div className="space-y-8 rounded-2xl border border-[#d3e0ea] bg-white p-6 shadow-sm sm:p-10 dark:border-[#285363] dark:bg-[#102a33]">
          <section>
            <h2>1. Information we collect</h2>
            <p>
              When you create or use a CAT Prep account, we may collect information you provide,
              such as your name, email address, and password. If you sign in with Google, we receive
              basic account information provided by Google, such as your name, email address, and
              verified account identifier needed to sign you in.
            </p>
          </section>

          <section>
            <h2>2. Practice and test data</h2>
            <p>
              We store information needed to provide the practice experience, including mock-test
              attempts, answers, scores, accuracy, and related progress information. This data is
              used to show your results and help you track your preparation.
            </p>
          </section>

          <section>
            <h2>3. How we use information</h2>
            <p>
              We use collected information to provide, maintain, secure, and improve CAT Prep;
              authenticate your account; save your test progress; calculate results; and respond to
              support or security requests.
            </p>
          </section>

          <section>
            <h2>4. Cookies and authentication</h2>
            <p>
              CAT Prep uses necessary cookies to maintain secure authenticated sessions and protect
              requests against cross-site request forgery. These cookies are used to operate the
              service and are not intended for advertising or cross-site tracking.
            </p>
          </section>

          <section>
            <h2>5. Google Sign-In</h2>
            <p>
              If you choose Google Sign-In, authentication is handled through Google. CAT Prep uses
              the account information returned through the Google authentication flow to create or
              access your CAT Prep account. We do not receive your Google password.
            </p>
          </section>

          <section>
            <h2>6. Data sharing</h2>
            <p>
              We do not sell your personal information. We may share information with service
              providers only when reasonably necessary to operate, secure, or maintain CAT Prep, or
              when required by applicable law.
            </p>
          </section>

          <section>
            <h2>7. Data security</h2>
            <p>
              We use reasonable technical and organizational measures to protect account and test
              data. No internet service can guarantee absolute security, so users should also use a
              unique password and protect their account credentials.
            </p>
          </section>

          <section>
            <h2>8. Data retention and deletion</h2>
            <p>
              We retain account and practice information for as long as needed to provide the
              service and for legitimate operational or legal purposes. If you want your account or
              associated personal data deleted, contact the CAT Prep team through the support
              channel made available by the service.
            </p>
          </section>

          <section>
            <h2>9. Children</h2>
            <p>
              CAT Prep is intended for people preparing for the CAT examination and is not directed
              at children. We do not knowingly collect personal information from children in a manner
              that violates applicable law.
            </p>
          </section>

          <section>
            <h2>10. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy as the service changes. The updated version will be
              published on this page with a revised “Last updated” date.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              If you have a privacy question or request, please use the support contact provided by
              CAT Prep.
            </p>
          </section>
        </div>
      </section>

      <footer className="border-t border-[#d3e0ea] dark:border-[#285363]">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span>© {new Date().getFullYear()} CAT Prep.</span>
          <div className="flex gap-5 font-semibold">
            <Link to="/" className="hover:text-[#1687a7]">Home</Link>
            <Link to="/login" className="hover:text-[#1687a7]">Log in</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default PrivacyPolicyPage;

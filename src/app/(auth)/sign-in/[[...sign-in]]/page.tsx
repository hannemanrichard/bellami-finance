import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="w-full max-w-md">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none",
            formButtonPrimary: "bg-[#0070BA] hover:bg-[#003087]",
          },
          variables: {
            colorPrimary: "#0070BA",
          },
        }}
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        forceRedirectUrl="/"
        fallbackRedirectUrl="/"
        signUpForceRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      />
    </div>
  );
}

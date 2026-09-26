import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md">
      <SignUp
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
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </div>
  );
}

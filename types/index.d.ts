interface User {
  name: string;
  email: string;
  id: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}
interface SignInParams {
  email: string;
  idToken: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "chat";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

type FormType = "sign-in" | "sign-up";

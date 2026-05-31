export type LoginFormValues = {
  workspace: string;
  email: string;
  password: string;
};

export type LoginResult = {
  token: string;
  workspace: string;
  tenant: {
    id: string;
    slug: string;
    name: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  permissions: string[];
  plan: {
    code: string;
    name: string;
  };
};

export type MockLoginResult = LoginResult;

export type MeResult = {
  tenant: {
    id: string;
    slug: string;
    name: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  permissions: string[];
  plan: {
    code: string;
    name: string;
  };
};

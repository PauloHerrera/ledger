export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface AccountsApiResponse {
  data?: Account[];
  accounts?: Account[];
}
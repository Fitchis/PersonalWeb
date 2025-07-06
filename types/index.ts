export type Status = "accept" | "reject" | "pending";

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export interface JobApplication {
  id: number;
  company: string;
  position: string;
  status: Status;
}

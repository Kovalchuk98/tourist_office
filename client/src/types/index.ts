export interface RootState {
  version: string;
}
export interface UserState {
  user: {
    _id?: string;
    email?: string;
    username?: string;
  };
  token?: string | null;
}
type Employee = {
  name: string;
  phone: string;
};

export interface ProposalState {
  _id?: string | undefined;
  name?: string;
  descr?: string;
  date?: Array<Date>;
  employee?: Employee;
  img?: string;
  file?: string;
  marker?: {
    name?: string;
    descr?: string;
    img?: string;
    location?: Array<number>;
  };
}

export interface ProposalSt {
  proposals?: Array<ProposalState>;
}


export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role: "FARMER" | "RETAILER" | "TRANSPORTER";
  address: string;
}

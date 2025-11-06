const ipRoot = process.env.REACT_APP_API_BASE_URL;

export interface LoginFormValues {
  taiKhoan: string;
  matKhau: string;
}

export interface RegisterFormValues {
  tenNhanVien: string;
  taiKhoan: string;
  matKhau: string;
  vaiTro: string;
}

export const loginAPI = async (values: LoginFormValues) => {
  const response = await fetch(`${ipRoot}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Đăng nhập thất bại!");
  return data;
};

export const registerAPI = async (values: RegisterFormValues) => {
  const response = await fetch(`${ipRoot}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Đăng ký thất bại!");
  return data;
};

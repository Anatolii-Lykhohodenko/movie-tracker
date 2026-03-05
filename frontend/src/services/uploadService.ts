import api from "./api";

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file)

  const { data } = await api.patch('/auth/avatar', formData);

  return data.user;
};
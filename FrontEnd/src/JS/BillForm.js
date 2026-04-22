import { api } from "../utils/api";

export const addBill = async (billData) => {
  try {
    const data = await api.post("/bills/add", billData);
    return data;
  } catch (error) {
    throw new Error("Failed to save bill");
  }
};

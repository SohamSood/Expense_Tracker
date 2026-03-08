export const addBill = async (billData) => {
  const response = await fetch("http://localhost:5001/api/bills", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(billData),
  });

  if (!response.ok) {
    throw new Error("Failed to save bill");
  }

  return response.json();
};

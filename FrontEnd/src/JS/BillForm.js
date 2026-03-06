export const addBill = async (billData) => {
  const response = await fetch("http://localhost:5000/api/bills", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(billData),
  });

  return response.json();
};

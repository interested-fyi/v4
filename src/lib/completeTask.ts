export const completeTask = async (
  privyDid: string,
  taskId: string,
  accessToken: string
) => {
  try {
    const response = await fetch("/api/quests/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ privyDid, taskId }),
    });

    if (!response.ok) {
      throw new Error("Failed to complete task");
    }

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error completing task:", error);
  }
};

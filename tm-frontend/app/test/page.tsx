const Page = async () => {
  // throw new Error("Not implemented yet");

  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();

  return (
    <div>
      Test page
      {response && (
        <div>
          Data fetched successfully
          <div>{JSON.stringify(data)}</div>
        </div>
      )}
    </div>
  );
};

export default Page;

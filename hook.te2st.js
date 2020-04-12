describe("describe", () => {
  expect(10).toBe(10);
  console.log("hi");

  test("nothing", () => {
    expect(20).toBe(20);
    console.log("bye");
  });

  beforeEach(() => {
    console.log("before");
  });

  test("nothing", () => {
    expect(20).toBe(20);
    console.log("bye");
  });
});

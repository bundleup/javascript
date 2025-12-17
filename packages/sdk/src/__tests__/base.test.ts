import { Base } from "../base";

// Mock the global fetch function
global.fetch = jest.fn();

// Create a concrete implementation of Base for testing
class TestBase extends Base<{ id: string; name: string }> {
  protected namespace = "test";
}

describe("Base", () => {
  let testBase: TestBase;
  const apiKey = "test-api-key";

  beforeEach(() => {
    testBase = new TestBase(apiKey);
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should fetch a list of resources", async () => {
      const mockData = [
        { id: "1", name: "Test 1" },
        { id: "2", name: "Test 2" },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await testBase.list();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it("should pass search parameters to the URL", async () => {
      const mockData = [{ id: "1", name: "Test 1" }];
      const searchParams = { filter: "active", limit: "10" };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await testBase.list(searchParams);

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl.toString()).toContain("filter=active");
      expect(callUrl.toString()).toContain("limit=10");
    });

    it("should throw an error if searchParams is not an object", async () => {
      await expect(testBase.list("invalid" as any)).rejects.toThrow(
        "List parameters must be an object."
      );
    });

    it("should throw an error if the fetch request fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(testBase.list()).rejects.toThrow("Failed to fetch");
    });
  });

  describe("create", () => {
    it("should create a new resource", async () => {
      const mockData = { id: "1", name: "New Test" };
      const body = { name: "New Test" };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await testBase.create(body);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          }),
          body: JSON.stringify(body),
        })
      );
      expect(result).toEqual(mockData);
    });

    it("should throw an error if body is not an object", async () => {
      await expect(testBase.create("invalid" as any)).rejects.toThrow(
        "Request body must be an object."
      );
    });

    it("should throw an error if the fetch request fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Bad Request",
      });

      await expect(testBase.create({ name: "Test" })).rejects.toThrow(
        "Failed to create"
      );
    });
  });

  describe("retrieve", () => {
    it("should retrieve a specific resource by ID", async () => {
      const mockData = { id: "1", name: "Test 1" };
      const id = "1";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await testBase.retrieve(id);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          }),
        })
      );

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl.toString()).toContain(id);
      expect(result).toEqual(mockData);
    });

    it("should throw an error if ID is not provided", async () => {
      await expect(testBase.retrieve("")).rejects.toThrow(
        "ID is required to retrieve a resource."
      );
    });

    it("should throw an error if the fetch request fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(testBase.retrieve("1")).rejects.toThrow(
        "Failed to retrieve"
      );
    });
  });

  describe("update", () => {
    it("should update a specific resource by ID", async () => {
      const mockData = { id: "1", name: "Updated Test" };
      const id = "1";
      const body = { name: "Updated Test" };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await testBase.update(id, body);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: "PATCH",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          }),
          body: JSON.stringify(body),
        })
      );

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl.toString()).toContain(id);
      expect(result).toEqual(mockData);
    });

    it("should throw an error if ID is not provided", async () => {
      await expect(testBase.update("", { name: "Test" })).rejects.toThrow(
        "ID is required to update a resource."
      );
    });

    it("should throw an error if body is not an object", async () => {
      await expect(testBase.update("1", "invalid" as any)).rejects.toThrow(
        "Request body must be an object."
      );
    });

    it("should throw an error if the fetch request fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Bad Request",
      });

      await expect(testBase.update("1", { name: "Test" })).rejects.toThrow(
        "Failed to update"
      );
    });
  });

  describe("del", () => {
    it("should delete a specific resource by ID", async () => {
      const id = "1";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await testBase.del(id);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          }),
        })
      );

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl.toString()).toContain(id);
    });

    it("should throw an error if ID is not provided", async () => {
      await expect(testBase.del("")).rejects.toThrow(
        "ID is required to delete a resource."
      );
    });

    it("should throw an error if the fetch request fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(testBase.del("1")).rejects.toThrow("Failed to delete");
    });
  });

  describe("URL building", () => {
    it("should build the correct URL structure", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await testBase.list();

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl.toString()).toContain("https://api.bundleup.io");
      expect(callUrl.toString()).toContain("v1/test");
    });
  });

  describe("headers", () => {
    it("should include the correct authorization header", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await testBase.list();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${apiKey}`,
          }),
        })
      );
    });
  });
});

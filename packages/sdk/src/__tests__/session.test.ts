import { Sessions } from "../session";

// Mock the global fetch function
global.fetch = jest.fn();

describe("Sessions", () => {
  let sessions: Sessions;
  const apiKey = "test-api-key";

  beforeEach(() => {
    sessions = new Sessions(apiKey);
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new session with required parameters", async () => {
      const mockResponse = {
        expires_in: 3600,
        token: "session_token_123",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await sessions.create({
        integrationId: "int_123",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.bundleup.io/v1/sessions",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          }),
          body: JSON.stringify({
            integrationId: "int_123",
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it("should create a session with externalId", async () => {
      const mockResponse = {
        expires_in: 3600,
        token: "session_token_123",
        externalId: "ext_456",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await sessions.create({
        integrationId: "int_123",
        externalId: "ext_456",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.bundleup.io/v1/sessions",
        expect.objectContaining({
          body: JSON.stringify({
            integrationId: "int_123",
            externalId: "ext_456",
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it("should create a session with metadata", async () => {
      const mockResponse = {
        expires_in: 3600,
        token: "session_token_123",
      };

      const metadata = { userId: "123", source: "web" };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await sessions.create({
        integrationId: "int_123",
        metadata,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.bundleup.io/v1/sessions",
        expect.objectContaining({
          body: JSON.stringify({
            integrationId: "int_123",
            metadata,
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it("should create a session with all parameters", async () => {
      const mockResponse = {
        expires_in: 7200,
        token: "session_token_123",
        externalId: "ext_456",
      };

      const metadata = { userId: "123", source: "mobile" };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await sessions.create({
        integrationId: "int_123",
        externalId: "ext_456",
        metadata,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.bundleup.io/v1/sessions",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          }),
          body: JSON.stringify({
            integrationId: "int_123",
            externalId: "ext_456",
            metadata,
          }),
        })
      );

      expect(result).toEqual(mockResponse);
      expect(result.expires_in).toBe(7200);
      expect(result.token).toBe("session_token_123");
      expect(result.externalId).toBe("ext_456");
    });

    it("should throw an error if the fetch request fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Bad Request",
      });

      await expect(
        sessions.create({
          integrationId: "int_123",
        })
      ).rejects.toThrow("Failed to create session");
    });

    it("should use the correct API endpoint", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expires_in: 3600,
          token: "token",
        }),
      });

      await sessions.create({
        integrationId: "int_123",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.bundleup.io/v1/sessions",
        expect.anything()
      );
    });

    it("should include authorization header", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expires_in: 3600,
          token: "token",
        }),
      });

      await sessions.create({
        integrationId: "int_123",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${apiKey}`,
          }),
        })
      );
    });
  });
});

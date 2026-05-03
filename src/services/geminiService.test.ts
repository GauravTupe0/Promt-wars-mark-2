import { callGeminiWithJSON } from './geminiService';

describe('geminiService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    process.env.VITE_GEMINI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.VITE_GEMINI_API_KEY;
  });

  describe('callGeminiWithJSON', () => {
    it('successfully calls Gemini API and parses JSON response', async () => {
      const mockResponseData = {
        prediction: 'Yes',
        confidence: 0.95,
        recommendations: ['Check voting location', 'Bring ID'],
      };

      const mockFetchResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify(mockResponseData) }],
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFetchResponse,
      });

      const userPrompt = 'How do I vote?';
      const result = await callGeminiWithJSON(userPrompt);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key='),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining(userPrompt),
        })
      );

      // Verify system instructions are included
      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);
      expect(requestBody.systemInstruction.parts[0].text).toContain('CivicGuide Assistant');
      expect(requestBody.generationConfig.responseMimeType).toBe('application/json');

      expect(result).toEqual(mockResponseData);
    });

    it('throws error when API response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      await expect(callGeminiWithJSON('test')).rejects.toThrow('Gemini API Error: 403');
    });

    it('throws error when JSON parsing of response text fails', async () => {
      const mockFetchResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: 'Invalid JSON String' }],
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFetchResponse,
      });

      await expect(callGeminiWithJSON('test')).rejects.toThrow(SyntaxError);
    });
  });
});

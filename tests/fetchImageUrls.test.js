const { google } = require("googleapis");
const { fetchImageUrls } = require("../index"); // Adjust the path if needed

jest.mock("googleapis", () => {
  const mockCustomsearch = {
    cse: {
      list: jest.fn(),
    },
  };
  return {
    google: {
      customsearch: jest.fn(() => mockCustomsearch),
    },
  };
});

describe("fetchImageUrls", () => {
  it("should fetch image URLs based on query", async () => {
    const query = "cute kittens";
    const numImages = 3;
    const mockResponse = {
      data: {
        items: [
          { link: "http://example.com/image1.jpg" },
          { link: "http://example.com/image2.jpg" },
          { link: "http://example.com/image3.jpg" },
        ],
      },
    };

    google.customsearch().cse.list.mockResolvedValue(mockResponse);

    const result = await fetchImageUrls(query, numImages);

    expect(result).toEqual([
      "http://example.com/image1.jpg",
      "http://example.com/image2.jpg",
      "http://example.com/image3.jpg",
    ]);
    expect(google.customsearch().cse.list).toHaveBeenCalledWith({
      auth: process.env.GOOGLE_API_KEY,
      cx: process.env.GOOGLE_CSE_ID,
      q: query,
      searchType: "image",
      num: numImages,
    });
  });
});

const axios = require("axios");
const fs = require("fs").promises;
const { downloadImage } = require("../index"); // Adjust the path if needed

jest.mock("axios");
jest.mock("fs", () => ({
  promises: {
    writeFile: jest.fn(),
  },
}));

describe("downloadImage", () => {
  it("should download and save the image", async () => {
    const url = "http://example.com/image.jpg";
    const filename = "image.jpg";
    const mockImageData = Buffer.from("mockImageData", "utf-8");

    axios.mockResolvedValue({ data: mockImageData });

    const result = await downloadImage(url, filename);

    expect(result).toBe(mockImageData.toString("base64"));
    expect(axios).toHaveBeenCalledWith({
      url,
      responseType: "arraybuffer",
    });
    expect(fs.writeFile).toHaveBeenCalledWith(filename, mockImageData);
  });
});

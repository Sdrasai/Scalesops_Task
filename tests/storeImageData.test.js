const { Client } = require("pg");
const { storeImageData } = require("../index"); // Adjust the path if needed

jest.mock("pg", () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

describe("storeImageData", () => {
  it("should store image data in the database", async () => {
    const imageData = "mockImageData";
    const mockClient = new Client();

    await storeImageData(imageData);

    expect(mockClient.connect).toHaveBeenCalled();
    expect(mockClient.query).toHaveBeenCalledWith(
      "INSERT INTO images (image_data) VALUES ($1)",
      [imageData]
    );
    expect(mockClient.end).toHaveBeenCalled();
  });
});



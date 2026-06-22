
describe("Vitest for SHA Hashing", () => {
  test('SHA-256 of "abc" matches standard vector', async () => {
    const result = await handleHash("abc");
    expect(result).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });
  test("hashes empty string vector correctly", async () => {
    const result = await handleHash("");
    expect(result).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });
});

describe("Vitest for ECDSA Key Generation", () => {
  test("ECDSA Key Generation - Should execute full pipeline successfully", async () => {
    const secretMessage = "Transaction Authorized: $500";

    const keys = await generateKeyPair();
    expect(keys.pubHex).toBeDefined();

    const signature = await signMessage(secretMessage, keys.rawPair);
    expect(signature).toBeDefined();

    const isLegit = await verifySignature(
      keys.rawPair,
      secretMessage,
      signature,
    );
    expect(isLegit).toBe(true);
  });
});

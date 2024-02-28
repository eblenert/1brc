import { extractLine } from "./extract-line"

describe("extract line", () => {
    it("should extract line", () => {
        const line = "Ghanzi;33.3"

        const result = extractLine(line);
        expect(result).toEqual({
            key: 'Ghanzi',
            value: 33.3
        })
    })
})
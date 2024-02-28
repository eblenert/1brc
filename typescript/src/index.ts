import fs from "fs"
import readline from "readline"
import { once } from "node:events";
import { extractLine } from "./extract-line";

type Measurement = {
    min: number,
    max: number,
    all: number
    length: number
}

export const readLinesFromFile = async (filePath: string) => {
    const fileStream = fs.createReadStream(filePath)

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    const result = new Map<string, Measurement>();
    rl.on("line", (line) => {
        const { key, value } = extractLine(line)
        const item = result.get(key)

        if (!item) {
            result.set(key, {
                min: value,
                max: value,
                all: value,
                length: 0
            })
        } else {
            if (item.max < value) {
                item.max = value
            }

            if (item.min > value) {
                item.min = value
            }

            item.all += value;
            item.length += 1
        }
    })

    await once(rl, "close");
    console.log(result)

}

const timer = async () => {
    console.time()
    await readLinesFromFile("../../measurements.txt")
    console.timeEnd()
}


timer().then(() => {
    console.log("Done.")
})

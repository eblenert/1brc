import { createReadStream } from "fs"
import { extractLine } from "./extract-line";

const DEMO_FILE = "../demo.txt"
const FILE = "../../measurements.txt"
type Measurement = {
    min: number,
    max: number,
    sum: number
    count: number
}

const SEMI_TOKEN = ";".charCodeAt(0)
const NEW_LINE_TOKEN = "\n".charCodeAt(0)
const parseChunk = (chunk: Buffer, result: Map<string, Measurement>) => {
    const city = Buffer.allocUnsafe(15).fill(0)
    const temperature = Buffer.allocUnsafe(5).fill(0)
    let tempValue = 0;
    let item: Measurement | undefined;
    let prev = 0;
    let cityLength = 0;


    for (let i = 0; i < chunk.length; i += 1) {
        if (chunk[i] === SEMI_TOKEN) {
            city.fill(0)
            chunk.copy(city, 0, prev, i)
            cityLength = i - prev
            prev = i + 1;
        }

        if (chunk[i] === NEW_LINE_TOKEN) {
            temperature.fill(0)
            chunk.copy(temperature, 0, prev, i)
            prev = i + 1

            tempValue = parseFloat(temperature.toString())


            item = result.get(city.toString('utf-8', 0, cityLength))

            if (item) {
                item.count++;
                item.sum += tempValue;
                item.max = Math.max(item.max, tempValue)
                item.min = Math.min(item.max, tempValue)
            } else {
                result.set(city.toString('utf-8', 0, cityLength), {
                    min: tempValue,
                    max: tempValue,
                    count: 1,
                    sum: tempValue
                })
            }
        }
    }
}
export const readLinesFromFile = async (filePath: string) => {
    const fileStream = createReadStream(filePath, {
        highWaterMark: 500 * 1024 * 1024,
        autoClose: true,
    })

    const result = new Map<string, Measurement>();

    let n = 0;

    return new Promise((resolve, reject) => {
        fileStream.on("data", (chunk: Buffer) => {
            n += 1;
            console.log(`chunk ${n}`)
            parseChunk(chunk, result);

        })
        fileStream.on("end", () => {
            console.log(result)
            resolve(result)
        })
    })


}

const timer = async () => {
    console.time()
    await readLinesFromFile(FILE)
    console.timeEnd()
}


timer().then(() => {
    console.log("Done.")
}).catch((err) => {
    console.error(err)
})

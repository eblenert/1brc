export const extractLine = (line: string) => {
    const semiIndex = line.indexOf(";")
    const key = line.slice(0, semiIndex)
    const value = line.slice(semiIndex + 1)

    return {
        key,
        value: parseFloat(value)
    }

}
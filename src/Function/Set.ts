/**
 * @description calculate a/b
 * */
export function getSetComplement<T>(a: Set<T>, b: Set<T>): Set<T>
{
    const result = new Set<T>();
    a.forEach(value =>
    {
        if (!b.has(value))
        {
            result.add(value);
        }
    });
    return result;
}
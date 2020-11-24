export function throwRangeIsUndefinedException(): never
{
    throw new Error('the key "range" should not be undefined. check esprima config');
}
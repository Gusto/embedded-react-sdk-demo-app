import { useParams } from "react-router-dom";

/**
 * A hook that extracts required route parameters and throws if any are missing.
 * 
 * @example
 * // Single param - returns string directly
 * const employeeId = useRequiredParams("employeeId");
 * 
 * @example
 * // Multiple params - returns object with all params
 * const { employeeId, jobId } = useRequiredParams("employeeId", "jobId");
 */
export function useRequiredParams<T extends string>(
  paramName: T
): string;
export function useRequiredParams<T extends string>(
  ...paramNames: T[]
): Record<T, string>;
export function useRequiredParams<T extends string>(
  ...paramNames: T[]
): string | Record<T, string> {
  const params = useParams();

  // Single param case - return string directly
  if (paramNames.length === 1) {
    const paramName = paramNames[0];
    const value = params[paramName];
    if (!value) {
      throw new Error(`Required param "${paramName}" is missing from route`);
    }
    return value;
  }

  // Multiple params case - return object
  const result = {} as Record<T, string>;
  for (const paramName of paramNames) {
    const value = params[paramName];
    if (!value) {
      throw new Error(`Required param "${paramName}" is missing from route`);
    }
    result[paramName] = value;
  }
  
  return result;
}

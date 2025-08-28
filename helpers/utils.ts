export const allowPopulate = (
  regex: RegExp,
  project?: Record<string, number>,
) => {
  if (!project) return true;

  let positiveProjection = true;

  const keys = Object.entries(project).map(([key, value]) => {
    if (value === 0) positiveProjection = false;

    return key;
  });

  const match = keys.some((key) => regex.test(key));

  return positiveProjection ? match : !match;
};

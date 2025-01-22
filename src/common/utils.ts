import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ROLES } from './enums';

dayjs.extend(relativeTime);

export function replaceUrlParams(
  url: string,
  params: { [key: string]: any },
): string {
  return url.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    // Check if the key exists in the params object, otherwise leave it as is
    return params[key];
    //!== undefined ? params[key] : `:${key}`;
  });
}

export function extractVariablesFromUrls(
  urls: string[],
): { key: string; value: string }[] {
  const variableSet = new Set<string>(); // Use a Set to avoid duplicates

  // Regex to match variables in the format {{<variable_name>}}
  const variableRegex = /{{(.*?)}}/g;

  // Iterate over each URL to extract variables
  urls.forEach((url) => {
    let match;
    while ((match = variableRegex.exec(url)) !== null) {
      variableSet.add(match[1]); // Add the variable name to the Set
    }
  });

  // Convert Set to array of objects with key-value pairs
  return Array.from(variableSet).map((variable) => ({
    key: variable,
    value: '',
  }));
}

export const calculateRows = (value: string): number => {
  const length = value?.length || 0;

  if (length < 50) {
    return 1;
  } else if (length >= 50 && length <= 100) {
    return 5;
  } else if (length > 100 && length <= 200) {
    return 8;
  } else if (length > 200 && length <= 400) {
    return 12;
  } else {
    return 15; // Cap the rows to a maximum of 15
  }
};

export const getModifiedFields = <T extends object, N extends object>(
  oldObject: Partial<T> = {} as Partial<T>,
  newObject: Partial<N> = {} as Partial<N>,
): Partial<N> => {
  const updatedFields = Object.keys(newObject).reduce((acc, key) => {
    const newValue = newObject[key as keyof N];
    const oldValue = oldObject[key as keyof T];

    // Handle special cases like Date objects
    const isEqual = (a: any, b: any): boolean => {
      if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime(); // Compare date values
      }
      return a === b; // Fallback for primitive types
    };

    if (!isEqual(newValue, oldValue)) {
      acc[key as keyof N] = newValue;
    }
    return acc;
  }, {} as Partial<N>);

  return updatedFields;
};

export const getTaskMembersRoles = (role: string) => {
  switch (role) {
    case ROLES.DIRECTOR:
      return Object.keys(ROLES);
    case ROLES.TEAM_LEAD:
      return [ROLES.DRAUGHTSMAN, ROLES.ARCHITECT, ROLES.TEAM_LEAD];
    case ROLES.ARCHITECT:
      return [ROLES.ARCHITECT];
    case ROLES.DRAUGHTSMAN:
      return [ROLES.DRAUGHTSMAN];
    default:
      return [ROLES.ARCHITECT, ROLES.DRAUGHTSMAN];
  }
};

export const getEmail = (object: any) => {
  const { recipient, projectName, name, subject, title } = object;
  return `mailto:${recipient}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(`Dear Sir/Madam,

Please find attached PDF/CAD file containing the following drawings:
${title}

Project name:
${projectName}

Coordinating with:

Comments/Revisions:

Regards,
Ar. ${name}
Horizon Architects.
M/s. Horizon Architects 
Unit No. 1, 2nd Floor, 
Washington Plaza Co-Op. Society Ltd., 
Dispensary Road, Topiwala Lane, 
Goregaon (W), Mumbai -  400104
Off Tel No - 022-49700915
  `)}`;
};

// <a href="https://ibb.co/GTRKh0K"><img src="https://i.ibb.co/Rycx59x/image.png" alt="image" border="0"></a>

/**
 * Copies the given content to the clipboard.
 * @param content - The text content to be copied.
 * @returns A promise that resolves to a boolean indicating success or failure.
 */
export const copyToClipboard = async function (
  content: string,
): Promise<boolean> {
  try {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      await navigator.clipboard.writeText(content);
      return true; // Successfully copied using Clipboard API
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;

      // Make the textarea invisible and append it to the document
      textArea.style.position = 'absolute';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);

      // Select and copy the content
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      return successful; // Successfully copied using execCommand
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

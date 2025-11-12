/**
 * 4 to 16 digits (letters, numbers, underscores, minus signs)
 */
export const usernameRegex = /^[\w-]{4,16}$/

/**
 *  8 to 64 digits, Majuscule, lowercase letters, numbers, `@#$%^&*`~()-+=`
 */
export const passwordRegex =
  /^\S*(?=\S{8,64})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/

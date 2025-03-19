export const random = {
  /** 
   * Generates a random floating-point number between 0 (inclusive) and 1 (exclusive)
   * 
   * @returns A random number in the range [0, 1)
   */
  random: function (): number {
    return Math.random();
  },

  /** 
   * Generates a random integer within the specified range.
   * 
   * @param start - The lower bound of the range (inclusive)
   * @param end - The upper bound of the range (exclusive)
   * @returns A random integer in the range [start, end)
   * @throws {Error} If start is greater than or equal to end
   */
  randint: function (start: number, end: number): number {
    // Validate parameters
    if (start >= end) {
      throw new Error('Start value must be less than end value');
    }
    
    // Convert to integers in case floating point numbers were provided
    const startInt = Math.ceil(start);
    const endInt = Math.floor(end);
    
    return startInt + Math.floor(Math.random() * (endInt - startInt));
  },

  /** 
   * Creates a new shuffled copy of the given array using the Fisher-Yates (Knuth) algorithm.
   * Uses structuredClone for proper deep copying of complex objects.
   * 
   * @param array - The array to shuffle
   * @returns A new shuffled copy of the original array
   */
  shuffleCopy: function <T>(array: T[]): T[] {
    // Use structuredClone for proper deep copying
    const arrayCopy = structuredClone(array);
    
    // Iterate through the array backwards
    for (let i = arrayCopy.length - 1; i > 0; i--) {
      // Generate a random number between 0 and the current index
      const j = Math.floor(Math.random() * (i + 1));
      // Swap the current item with the randomly chosen one
      const temp = arrayCopy[i];
      arrayCopy[i] = arrayCopy[j];
      arrayCopy[j] = temp;
    }
    
    return arrayCopy;
  },

  /**
   * Randomly shuffles an array in-place using the Fisher-Yates (Knuth) algorithm.
   * 
   * @param array - The array to shuffle
   * @returns The same array, now shuffled (for chaining convenience)
   */
  shuffle: function <T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array; // Return the array for chaining
  },

  /** Sample a specified number of elements from an array, allowing for either repeated or non-repeated sampling.
   *
   * @param arr
   * @param num  The sample size.
   * @param repeat if true, the sampled array could have repeated element; otherwise, not.
   * @returns
   */
  sample: function <T>(arr: T[], num: number, repeat = false): T[] {
    const result: T[] = [];
    const new_arr: T[] = Array.from(arr);

    // If repeat is false, sample without repetition
    if (!repeat) {
      // Repeat num times
      for (let i = 0; i < num; i++) {
        // Randomly generate a number between 0 and new_arr.length - 1
        const ran = Math.floor(Math.random() * new_arr.length);
        // Add the element at index ran of new_arr to the result array
        result.push(new_arr.splice(ran, 1)[0]);
        // Remove the element at index ran from new_arr
      }
    } else {
      // Repeat num times
      for (let i = 0; i < num; i++) {
        // Randomly generate a number between 0 and arr.length - 1
        const ran = Math.floor(Math.random() * arr.length);
        // Add the element at index ran of arr to the result array
        result.push(arr[ran]);
      }
    }

    // Return the sampled elements array
    return result;
  },
};

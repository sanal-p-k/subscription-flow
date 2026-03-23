/**
 * Calculates the discount and final price using strict integer math.
 * Time Complexity: O(1)
 *
 * @param planPrice - original price in integer (e.g. cents)
 * @param discountPercent - discount percentage (0 to 100)
 * @returns { originalPrice: number, discountAmount: number, finalPrice: number }
 */
export const calculatePrice = (planPrice: number, discountPercent: number) => {
    // discountAmount = floor(planPrice * discountPercent / 100)
    const discountAmount = Math.floor((planPrice * discountPercent) / 100);

    // finalPrice = originalPrice - discountAmount
    const finalPrice = planPrice - discountAmount;

    return {
        originalPrice: planPrice,
        discountAmount,
        finalPrice
    };
};

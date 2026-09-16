export const PRODUCT_PLACEHOLDER =
  "/images/products/placeholder.webp";

export function handleProductImageError(
  event
) {
  event.currentTarget.onerror = null;

  event.currentTarget.src =
    PRODUCT_PLACEHOLDER;
}
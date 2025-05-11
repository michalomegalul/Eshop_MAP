/**
 * Utility functions for handling images
 */

/**
 * Get the URL for a product image
 * @returns The URL for the product logo
 */
export function getProductImageUrl(): string {
  return '/DP-logo-small.png';
}

/**
 * Get Richard's CEO image URL
 * @returns The URL for Richard's photo
 */
export function getCEOImageUrl(): string {
  return '/richard.jpg';
}

/**
 * Get logo image URL
 * @param isDarkMode - Whether to use the dark mode logo
 * @returns The URL for the company logo
 */
export function getLogoUrl(isDarkMode = false): string {
  return isDarkMode ? '/DP-logo-white.png' : '/DP-logo.png';
}

/**
 * Get icon image URL
 * @param name - Name of the icon
 * @returns The URL for the icon
 */
export function getIconUrl(name: string): string {
  const icons: Record<string, string> = {
    'facebook': '/facebook.png',
    'instagram': '/instagram.png',
    'email': '/email.png',
    'phone': '/phone.png',
    'shop': '/icon-shop.png',
    'shop-dark': '/icon-shop-dark.png',
    'moon': '/icon-moon.png',
    'cart': '/shopping-cart.png',
  };
  
  return icons[name] || '/logo-placeholder.svg';
}

/**
 * Get a fallback image URL in case the requested image is unavailable
 * @returns A fallback image URL
 */
export function getFallbackImageUrl(): string {
  return '/logo-placeholder.svg';
}

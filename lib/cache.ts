// Simple in-memory cache implementation

interface CacheItem<T> {
  value: T
  expiry: number | null // null means no expiry
}

class Cache {
  private cache: Map<string, CacheItem<any>> = new Map()

  /**
   * Get an item from the cache
   * @param key Cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key)

    if (!item) {
      return undefined
    }

    // Check if the item has expired
    if (item.expiry !== null && Date.now() > item.expiry) {
      this.cache.delete(key)
      return undefined
    }

    return item.value
  }

  /**
   * Set an item in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in seconds (optional)
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const expiry = ttl ? Date.now() + ttl * 1000 : null

    this.cache.set(key, {
      value,
      expiry,
    })
  }

  /**
   * Remove an item from the cache
   * @param key Cache key
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get the number of items in the cache
   */
  size(): number {
    return this.cache.size
  }
}

// Export a singleton instance
export const cache = new Cache()


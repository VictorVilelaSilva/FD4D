import { ReactNode } from 'react'

/**
 * Tool Interface
 *
 * Defines the structure of a tool in the FD4D toolkit.
 * Each tool must implement this interface to be registered in the system.
 */
export interface Tool {
  /** Unique identifier for the tool */
  id: string

  /** Display name shown in the UI */
  name: string

  /** Brief description of what the tool does */
  description: string

  /** Icon name or component (can be emoji or custom component) */
  icon: string | ReactNode

  /** Category for grouping tools in the sidebar */
  category: 'generator' | 'encoder' | 'converter' | 'utility' | 'other'

  /** The React component to render when the tool is selected */
  component: React.ComponentType

  /** Optional keyboard shortcut (e.g., 'ctrl+shift+c') */
  shortcut?: string

  /** Optional tags for search/filtering */
  tags?: string[]
}

/**
 * Tool Registry
 *
 * Central registry for all tools in the application.
 * Provides a simple, extensible system for adding new tools without modifying core code.
 */
class ToolRegistry {
  private tools: Map<string, Tool> = new Map()

  /**
   * Register a new tool
   *
   * @param tool - The tool configuration to register
   * @throws Error if a tool with the same ID already exists
   *
   * @example
   * ```ts
   * toolRegistry.register({
   *   id: 'base64-encoder',
   *   name: 'Base64 Encoder',
   *   description: 'Encode and decode Base64 strings',
   *   icon: '🔐',
   *   category: 'encoder',
   *   component: Base64EncoderComponent,
   *   tags: ['base64', 'encode', 'decode']
   * })
   * ```
   */
  register(tool: Tool): void {
    if (this.tools.has(tool.id)) {
      throw new Error(`Tool with id "${tool.id}" is already registered`)
    }
    this.tools.set(tool.id, tool)
  }

  /**
   * Register multiple tools at once
   *
   * @param tools - Array of tool configurations to register
   */
  registerMany(tools: Tool[]): void {
    tools.forEach((tool) => this.register(tool))
  }

  /**
   * Get a tool by its ID
   *
   * @param id - The unique identifier of the tool
   * @returns The tool configuration or undefined if not found
   */
  getTool(id: string): Tool | undefined {
    return this.tools.get(id)
  }

  /**
   * Get all registered tools
   *
   * @returns Array of all registered tools
   */
  getAllTools(): Tool[] {
    return Array.from(this.tools.values())
  }

  /**
   * Get tools by category
   *
   * @param category - The category to filter by
   * @returns Array of tools in the specified category
   */
  getToolsByCategory(category: Tool['category']): Tool[] {
    return this.getAllTools().filter((tool) => tool.category === category)
  }

  /**
   * Search tools by name, description, or tags
   *
   * @param query - Search query string
   * @returns Array of tools matching the search query
   */
  searchTools(query: string): Tool[] {
    const lowercaseQuery = query.toLowerCase()
    return this.getAllTools().filter((tool) => {
      const nameMatch = tool.name.toLowerCase().includes(lowercaseQuery)
      const descMatch = tool.description.toLowerCase().includes(lowercaseQuery)
      const tagMatch = tool.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
      return nameMatch || descMatch || tagMatch
    })
  }

  /**
   * Remove a tool from the registry
   *
   * @param id - The unique identifier of the tool to remove
   * @returns true if the tool was removed, false if it wasn't found
   */
  unregister(id: string): boolean {
    return this.tools.delete(id)
  }

  /**
   * Clear all registered tools
   */
  clear(): void {
    this.tools.clear()
  }

  /**
   * Get the total number of registered tools
   */
  get count(): number {
    return this.tools.size
  }
}

// Export a singleton instance
export const toolRegistry = new ToolRegistry()

/**
 * Helper function to create a tool configuration with type safety
 *
 * @param config - Tool configuration object
 * @returns The same configuration object (for type inference)
 */
export function createTool(config: Tool): Tool {
  return config
}

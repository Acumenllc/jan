/**
 * Tauri Core Service - Desktop implementation
 */

import { invoke, convertFileSrc } from '@tauri-apps/api/core'
import type { ExtensionManifest } from '@/lib/extension'
import type { InvokeArgs } from './types'
import { DefaultCoreService } from './default'
import type { WebExtensionRegistry, WebExtensionName } from '@jan/extensions-web'

export class TauriCoreService extends DefaultCoreService {
  async invoke<T = unknown>(command: string, args?: InvokeArgs): Promise<T> {
    try {
      return await invoke<T>(command, args)
    } catch (error) {
      console.error(`Error invoking Tauri command '${command}' in Tauri:`, error)
      throw error
    }
  }

  convertFileSrc(filePath: string, protocol?: string): string {
    try {
      // For web extensions, handle special web:// URLs
      if (filePath.startsWith('web://')) {
        const extensionName = filePath.replace('web://', '')
        return `@jan/extensions-web/${extensionName}`
      }
      return convertFileSrc(filePath, protocol)
    } catch (error) {
      console.error('Error converting file src in Tauri:', error)
      return filePath
    }
  }

  // Extension management - using invoke + web extensions
  async getActiveExtensions(): Promise<ExtensionManifest[]> {
    try {
      // Get native Tauri extensions
      const nativeExtensions = await this.invoke<ExtensionManifest[]>('get_active_extensions')

      // Get web extensions (like jan-provider-web)
      const webExtensions = await this.getWebExtensions()

      // Combine both types of extensions
      return [...nativeExtensions, ...webExtensions]
    } catch (error) {
      console.error('Error getting active extensions in Tauri:', error)
      return []
    }
  }

  private async getWebExtensions(): Promise<ExtensionManifest[]> {
    try {
      const { WEB_EXTENSIONS } = await import('@jan/extensions-web')
      const manifests: ExtensionManifest[] = []

      // Create manifests and register extensions
      const entries = Object.entries(WEB_EXTENSIONS) as [WebExtensionName, WebExtensionRegistry[WebExtensionName]][]
      for (const [name, loader] of entries) {
        try {
          // Load the extension module
          const extensionModule = await loader()
          const ExtensionClass = extensionModule.default

          // Create extension instance
          const extensionInstance = new ExtensionClass(
            `web://${name}`,
            name,
            name, // productName
            true, // active
            `Web extension: ${name}`, // description
            '1.0.0' // version
          )

          // Initialize the extension
          if (typeof extensionInstance.onLoad === 'function') {
            const result = extensionInstance.onLoad()
            if (result instanceof Promise) {
              await result
            }
          }

          // Create manifest data with initialized extension instance
          const manifest = {
            url: `web://${name}`,
            name,
            productName: name,
            active: true,
            description: `Web extension: ${name}`,
            version: '1.0.0',
            extensionInstance
          }

          manifests.push(manifest)
        } catch (error) {
          console.error(`Failed to register web extension '${name}':`, error)
        }
      }

      return manifests
    } catch (error) {
      console.error('Failed to get web extensions:', error)
      return []
    }
  }

  async installExtensions(): Promise<void> {
    try {
      return await this.invoke<void>('install_extensions')
    } catch (error) {
      console.error('Error installing extensions in Tauri:', error)
      throw error
    }
  }

  async installExtension(extensions: ExtensionManifest[]): Promise<ExtensionManifest[]> {
    try {
      return await this.invoke<ExtensionManifest[]>('install_extension', { extensions })
    } catch (error) {
      console.error('Error installing extension in Tauri:', error)
      return []
    }
  }

  async uninstallExtension(extensions: string[], reload = true): Promise<boolean> {
    try {
      return await this.invoke<boolean>('uninstall_extension', { extensions, reload })
    } catch (error) {
      console.error('Error uninstalling extension in Tauri:', error)
      return false
    }
  }

  // App token
  async getAppToken(): Promise<string | null> {
    try {
      const result = await this.invoke<string | null>('app_token')
      return result
    } catch (error) {
      console.error('Error getting app token in Tauri:', error)
      return null
    }
  }
}
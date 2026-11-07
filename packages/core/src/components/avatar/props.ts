import type * as avatar from '@zag-js/avatar'

export type AvatarProps = avatar.Props & {
  /**
   * The source URL of the avatar image.
   */
  src?: string
  /**
   * The alt text for the avatar image.
   */
  alt?: string
}

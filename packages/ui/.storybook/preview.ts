import React from 'react'
import type { Preview, Decorator } from '@storybook/react'
import '../src/styles/globals.css'

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Agency brand theme',
    defaultValue: 'atlora',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'atlora',   title: 'Atlora (default)' },
        { value: 'meridian', title: 'Meridian Travel' },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
}

const withTheme: Decorator = (Story, context) =>
  React.createElement(
    'div',
    { 'data-theme': context.globals['theme'] ?? 'atlora' },
    React.createElement(Story)
  )

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'cream',
      values: [
        { name: 'cream',    value: '#FAF8F6' },
        { name: 'white',    value: '#FFFFFF' },
        { name: 'charcoal', value: '#343432' },
        { name: 'admin',    value: '#F5F5F5' },
      ],
    },
  },
}

export default preview
